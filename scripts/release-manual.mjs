import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "out");
const releaseDir = path.join(root, "outputs", "manual-release");
const webDir = path.join(releaseDir, "web");
const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
const versionJson = existsSync(path.join(root, "VERSION.json"))
  ? JSON.parse(await readFile(path.join(root, "VERSION.json"), "utf8"))
  : {};
const now = new Date();
const buildId = `${packageJson.version || "1.0.0"}-${now.toISOString().replace(/[:.]/g, "-")}`;

function gitOutput(args, fallback = "") {
  try {
    return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
  } catch {
    return fallback;
  }
}

const commitSha = gitOutput(["rev-parse", "--short", "HEAD"], "unknown");
const commitFullSha = gitOutput(["rev-parse", "HEAD"], "unknown");
const recentCommits = gitOutput(["log", "--oneline", "-12"], "No git history found.");
const changedFiles = gitOutput(["diff-tree", "--no-commit-id", "--name-status", "-r", "HEAD"], "No file list available.");

if (!existsSync(outDir)) {
  throw new Error("Missing out/ build folder. Run npm run build before creating a manual release.");
}

await rm(releaseDir, { recursive: true, force: true });
await mkdir(releaseDir, { recursive: true });
await cp(outDir, webDir, { recursive: true });

const releaseNotes = `# AURA Manual Release

- Build ID: ${buildId}
- Created: ${now.toUTCString()}
- App version: ${packageJson.version || "1.0.0"}
- Git commit: ${commitSha}
- Android version code: ${versionJson.androidVersionCode || "not set"}
- iOS build number: ${versionJson.iosBuildNumber || "not set"}
- App name: AURA
- Public domain: https://www.auramusichub.com/

## Owner Review

Review this package before publishing it publicly.

Read \`owner-change-report.md\` first. That file shows the private code/documentation changes included in this build.

## Must Test

- Home page loads on desktop and phone
- Playback controls work
- Search and collection tags work
- Account sign-in survives app/browser restart
- Owner Admin dashboard appears for the owner email
- Uploads enter pending review
- Pending uploads do not appear publicly until published
- Dark/light mode works
- PWA install prompt or installed app behavior is acceptable
`;

const ownerChangeReport = `# Owner-Only Change Report

- Build ID: ${buildId}
- Created: ${now.toUTCString()}
- Git commit: ${commitFullSha}
- App version: ${packageJson.version || "1.0.0"}
- Visibility: private owner review only

This report is for the owner/admin. Do not use it as public release notes unless you intentionally publish it.

## Recent Commits

\`\`\`text
${recentCommits}
\`\`\`

## Files Changed In This Commit

\`\`\`text
${changedFiles}
\`\`\`

## How To Review Before Public Release

1. Open and test the static build in \`outputs/manual-release/web/\`.
2. Read this file and \`publish-checklist.md\`.
3. Confirm the Admin dashboard, legal pages, account flow, upload flow, and playback still work.
4. Only after owner approval, upload \`outputs/manual-release/web/\` manually to Cloudflare Pages or promote the chosen preview deployment.
`;

const checklist = `# Publish Checklist

Do not publish until each item is checked.

- [ ] I reviewed the app at the manual release build.
- [ ] I tested login on computer and phone.
- [ ] I tested playback with real songs.
- [ ] I confirmed uploads are manually reviewed before publishing.
- [ ] I confirmed admin access works for the owner account.
- [ ] I confirmed privacy policy, support contact, and terms are ready.
- [ ] I confirmed all public music, cover art, and lyrics have rights clearance.
- [ ] I confirmed the release is ready for public users.

## Manual Public Release

- Cloudflare: Upload \`outputs/manual-release/web/\` as a direct upload deployment, inspect preview, then promote to production.
- Google Play: Upload signed \`.aab\` manually in Play Console.
- Apple: Upload archive manually through Xcode/App Store Connect.
`;

const storeMetadata = {
  appName: "AURA",
  shortName: "AURA",
  packageId: "com.auramusichub.app",
  version: packageJson.version || "1.0.0",
  androidVersionCode: versionJson.androidVersionCode || null,
  iosBuildNumber: versionJson.iosBuildNumber || null,
  category: "Music",
  website: "https://www.auramusichub.com/",
  supportEmail: "",
  privacyPolicyUrl: "",
  shortDescription: "Your music. Your moments. Your AURA.",
  fullDescription: "AURA is a music streaming workspace for discovering songs, following artists, saving favorites, reading synchronized lyrics, and managing releases through an owner dashboard.",
  manualReleaseRequired: true,
};

await writeFile(path.join(releaseDir, "release-notes.md"), releaseNotes);
await writeFile(path.join(releaseDir, "owner-change-report.md"), ownerChangeReport);
await writeFile(path.join(releaseDir, "publish-checklist.md"), checklist);
await writeFile(path.join(releaseDir, "store-metadata.json"), `${JSON.stringify(storeMetadata, null, 2)}\n`);

console.log(`Manual release package created at ${path.relative(root, releaseDir)}`);
console.log("Nothing has been published. Review this package, then publish manually when ready.");
