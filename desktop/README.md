# Desktop (Tauri 2)

Native Windows and Linux wrapper around `frontend/`.

```bash
# backend API on :3333
cd ../backend && yarn dev

# desktop window
cd ../desktop
yarn install
yarn dev
```

Linux bundles: `yarn build:linux`  
Windows NSIS (on Windows): `yarn build:windows`

See the root README for prerequisites and artifact paths.
