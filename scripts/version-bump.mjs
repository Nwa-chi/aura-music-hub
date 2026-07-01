import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const bump = process.argv[2];
const note = process.argv.slice(3).join(" ").trim() || "Software update.";

if (!bump) {
  console.error("Usage: npm run version:bump -- patch \"What changed\"");
  console.error("Use patch, minor, major, or an exact version like 1.2.3.");
  process.exit(1);
}

function parseVersion(version) {
  const match = String(version).match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) throw new Error(`Invalid version: ${version}. Use x.y.z, patch, minor, or major.`);
  return match.slice(1).map(Number);
}

function nextVersion(current, type) {
  const [major, minor, patch] = parseVersion(current);
  if (/^\d+\.\d+\.\d+$/.test(type)) return type;
  if (type === "patch") return `${major}.${minor}.${patch + 1}`;
  if (type === "minor") return `${major}.${minor + 1}.0`;
  if (type === "major") return `${major + 1}.0.0`;
  throw new Error(`Unknown version bump: ${type}. Use patch, minor, major, or x.y.z.`);
}

function nativeVersion(version) {
  const [major, minor, patch] = parseVersion(version);
  return patch === 0 ? `${major}.${minor}` : version;
}

async function readJson(file) {
  return JSON.parse(await readFile(path.join(root, file), "utf8"));
}

async function writeJson(file, data) {
  await writeFile(path.join(root, file), `${JSON.stringify(data, null, 2)}\n`);
}

async function replaceInFile(file, replacements) {
  const filePath = path.join(root, file);
  let text = await readFile(filePath, "utf8");
  for (const [pattern, replacement] of replacements) {
    text = text.replace(pattern, replacement);
  }
  await writeFile(filePath, text);
}

const packageJson = await readJson("package.json");
const versionJson = existsSync(path.join(root, "VERSION.json"))
  ? await readJson("VERSION.json")
  : { androidVersionCode: 1, iosBuildNumber: 1 };

const currentVersion = packageJson.version || versionJson.version || "1.0.0";
const newVersion = nextVersion(currentVersion, bump);
const appVersion = nativeVersion(newVersion);
const nextAndroidCode = Number(versionJson.androidVersionCode || 1) + 1;
const nextIosBuild = Number(versionJson.iosBuildNumber || 1) + 1;
const date = new Date().toISOString();

packageJson.version = newVersion;
await writeJson("package.json", packageJson);

if (existsSync(path.join(root, "package-lock.json"))) {
  const lockJson = await readJson("package-lock.json");
  lockJson.version = newVersion;
  if (lockJson.packages?.[""]) lockJson.packages[""].version = newVersion;
  await writeJson("package-lock.json", lockJson);
}

await writeJson("VERSION.json", {
  name: "AURA",
  version: newVersion,
  androidVersionCode: nextAndroidCode,
  iosBuildNumber: nextIosBuild,
  releasedAt: null,
  preparedAt: date,
  status: "prepared",
  notes: note,
});

if (existsSync(path.join(root, "android/app/build.gradle"))) {
  await replaceInFile("android/app/build.gradle", [
    [/versionCode\s+\d+/, `versionCode ${nextAndroidCode}`],
    [/versionName\s+"[^"]+"/, `versionName "${appVersion}"`],
  ]);
}

if (existsSync(path.join(root, "ios/App/App.xcodeproj/project.pbxproj"))) {
  await replaceInFile("ios/App/App.xcodeproj/project.pbxproj", [
    [/CURRENT_PROJECT_VERSION = \d+;/g, `CURRENT_PROJECT_VERSION = ${nextIosBuild};`],
    [/MARKETING_VERSION = [^;]+;/g, `MARKETING_VERSION = ${appVersion};`],
  ]);
}

const historyPath = path.join(root, "VERSION_HISTORY.md");
const existingHistory = existsSync(historyPath) ? await readFile(historyPath, "utf8") : "# AURA Version History\n";
const entry = `\n## ${newVersion}\n\n- Status: prepared\n- Prepared: ${date}\n- Android version code: ${nextAndroidCode}\n- iOS build number: ${nextIosBuild}\n- Notes: ${note}\n`;
await writeFile(historyPath, `${existingHistory.trim()}\n${entry}`);

console.log(`AURA version prepared: ${currentVersion} -> ${newVersion}`);
console.log(`Android versionCode: ${nextAndroidCode}`);
console.log(`iOS build number: ${nextIosBuild}`);
console.log("Review VERSION_HISTORY.md, then run npm run release:manual when ready.");
