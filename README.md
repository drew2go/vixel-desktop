# Vixel Admin (desktop)

Electron wrapper around https://vixelagency.com/admin/. No app logic lives here — the portal is the web app.

- Run locally: `npm install && npm start`
- Build: `npm run dist:mac` / `npm run dist:win` (output in `dist/`)
- Release: push a tag `vX.Y.Z`; GitHub Actions builds the macOS DMGs (arm64 + x64) and the Windows installer and attaches them to the release. The admin panel links to `releases/latest/download/<artifact>`.

Builds are unsigned: macOS shows "unidentified developer" (right-click → Open once), Windows SmartScreen shows "More info → Run anyway".
