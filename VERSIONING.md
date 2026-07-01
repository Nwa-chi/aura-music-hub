# AURA Versioning

Use this when you are ready to prepare a software update.

## Bump Version

```bash
npm run version:bump -- patch "Short note about what changed"
```

Other options:

```bash
npm run version:bump -- minor "Bigger feature update"
npm run version:bump -- major "Major release"
npm run version:bump -- 1.2.3 "Exact version number"
```

The command updates:

- `package.json`
- `package-lock.json`
- `VERSION.json`
- `VERSION_HISTORY.md`
- Android `versionName` and `versionCode`
- iOS `MARKETING_VERSION` and `CURRENT_PROJECT_VERSION`

## Build A Manual Release

After bumping the version:

```bash
npm run release:manual
```

That package is saved under `outputs/manual-release/` for review before you manually publish.

## Version Rules

- Patch: small fixes, text changes, admin improvements, bug fixes.
- Minor: new features, new workflows, meaningful UI upgrades.
- Major: breaking changes, full relaunch, major platform changes.

Android `versionCode` and iOS build number must always increase for store submissions. The version command handles that automatically.
