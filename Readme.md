<<<<<<< HEAD
# Manage – Multi-Workspace Productivity Platform
=======
# Meraki - Personal Dashboard & Productivity Extension
>>>>>>> b1718923ca32fe5b9debe28414d3f8bb55644c86

A unified codebase that powers the Manage Chrome extension and the companion mobile application. Both workspaces share Firebase-backed data and Gemini AI helpers through a common `shared/` library.

## Repository Layout

```
.
├── extension/          # Chrome extension workspace (Vite + React)
├── mobile/             # React Native (Expo) mobile workspace
├── shared/             # Cross-platform Firebase, AI, and type modules
├── packages/api/       # (Optional) Node API playground wired to shared helpers
└── README.md
```

Each workspace owns its dependencies, tooling, and environment files. Shared utilities are authored in TypeScript and consumed via the `@shared/*` path alias.

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Chrome (for the extension) and Expo Go or an emulator (for the mobile app)

### 1. Bootstrap Firebase & Gemini Credentials

Create environment files for both workspaces using the provided templates:

```
cp extension/.env.example extension/.env
cp mobile/.env.example mobile/.env
```

Populate them with your Firebase project details and a Gemini API key. The shared helpers accept both generic (`FIREBASE_API_KEY`) and Vite-prefixed (`VITE_FIREBASE_API_KEY`) keys, so you can reuse the same values in every workspace.

### 2. Install Dependencies

Workspaces manage dependencies independently:

```
cd extension
npm install

cd ../mobile
npm install
```

If you plan to tinker with the sample API service:

```
cd packages/api
npm install
```

### 3. Run the Chrome Extension

```
cd extension
npm run dev
```

The development server exposes hot-reloaded entry points for the new tab, popup, background, and content scripts. Load the built extension by running `npm run build`, then selecting the generated `extension/dist` folder inside `chrome://extensions`.

### 4. Run the Mobile App (Expo)

```
cd mobile
npm start
```

Metro will start with shared sources whitelisted via `metro.config.js`. Scan the QR code with Expo Go or launch the Android/iOS simulator from the CLI.

## Shared Modules

- **`shared/firebase`** – Idempotent Firebase initialisation, Firestore helpers, and collection constants. Used by both the extension and mobile sync service.
- **`shared/ai/gemini`** – A thin wrapper around `@google/generative-ai` that standardises prompts and responses for future AI features.
- **`shared/types`** – Canonical TypeScript entities (`Task`, `Note`, `TransferData`, etc.) with identical shapes across workspaces.
- **`shared/utils/env`** – Environment helpers that reconcile Vite, Node, and Expo configuration sources.

Import shared modules with `@shared/...`. Examples:

```ts
import { initializeFirebase } from '@shared/firebase';
import { createGeminiClient } from '@shared/ai/gemini';
import type { Task } from '@shared/types';
```

## Firebase & Sync Pipeline

1. **Configuration** – `shared/utils/env` reads Firebase keys from `.env` files (supporting both generic and Vite-prefixed names).
2. **Initialisation** – `initializeFirebase` lazily boots the SDK and caches the app/auth/database trio.
3. **Extension Usage** – `extension/src/services/firebaseConfig.ts` now imports the shared helper, preserving existing UI logic.
4. **Mobile Usage** – `mobile/src/config/environment.ts` bridges Expo `extra` values into the shared helpers. `syncService.pushSnapshotToCloud` illustrates how to push merged data to Firestore.
5. **Backend (optional)** – `packages/api/src/firebase.ts` reuses the same helper for server-side interactions.

## Gemini Integration Stubs

- Centralised client factory in `shared/ai/gemini.ts` with `generate` and `summarize` helpers.
- Extension service `geminiService.ts` consumes the shared client without altering UI contracts.
- Mobile exposes `aiService.ts` for future AI-powered suggestions and summaries. Screens can await these helpers once credentials are supplied.

Add your Gemini key to both `.env` files and the shared wrapper becomes operational instantly.

## Workspace Notes

### Extension (`extension/`)

- Tooling: Vite, React, TypeScript, Tailwind.
- Scripts: `npm run dev`, `npm run build`, `npm run lint`, `npm run type-check`.
- Environment: `.env` (values with `VITE_` prefix). Additional allowlist added in `vite.config.ts` so imports from `../shared` resolve safely.

### Mobile (`mobile/`)

- Tooling: Expo SDK 49, React Navigation, AsyncStorage.
- New files: `metro.config.js`, `babel.config.js`, `tsconfig.json`, `app.config.js`, and platform stubs under `android/` and `ios/`.
- Shared bootstrap: importing `./src/config/environment` in `App.tsx` ensures Firebase/Gemini are initialised before any components render.

<<<<<<< HEAD
### Shared (`shared/`)

- All modules are TypeScript-first and shipped without build output. Both Vite and Metro compile them on demand.
- A quick tour is available in `shared/README.md`.

### API Playground (`packages/api/`)

- Optional Node Apollo/Express prototype updated to use shared Firebase helpers.
- Run with `npm run dev` after installing dependencies.

## Environment Reference

| Variable | Description | Extension | Mobile |
|----------|-------------|-----------|--------|
| `FIREBASE_API_KEY` / `VITE_FIREBASE_API_KEY` | Firebase Web API key | ✅ | ✅ |
| `FIREBASE_AUTH_DOMAIN` / `VITE_FIREBASE_AUTH_DOMAIN` | Auth domain | ✅ | ✅ |
| `FIREBASE_PROJECT_ID` / `VITE_FIREBASE_PROJECT_ID` | Project identifier | ✅ | ✅ |
| `FIREBASE_STORAGE_BUCKET` / `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket | ✅ | ✅ |
| `FIREBASE_MESSAGING_SENDER_ID` / `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID | ✅ | ✅ |
| `FIREBASE_APP_ID` / `VITE_FIREBASE_APP_ID` | App ID | ✅ | ✅ |
| `GEMINI_API_KEY` / `VITE_GEMINI_API_KEY` | Google AI key | ✅ | ✅ |
| `GEMINI_MODEL` / `VITE_GEMINI_MODEL` | Default Gemini model | optional | optional |

Expo’s `app.config.js` copies the mobile `.env` values into `Constants.expoConfig.extra`, which is then bridged into the shared environment helper.

## Development Tips

- **Chrome Extension** – Re-run `npm run build` before loading into Chrome. During development, `npm run dev` exposes HMR endpoints but still requires `chrome://extensions` for final verification.
- **Expo App** – The Metro config already whitelists `../shared`, but if you add new directories outside `mobile/`, append them to `watchFolders`.
- **Shared Changes** – Because both workspaces compile shared TypeScript directly, edits apply instantly without a separate build step.

## Next Steps

- Implement authenticated user flows and Firestore security rules.
- Expand the shared AI layer with prompt templates and caching.
- Add automated tests (`vitest` for extension, `jest` for mobile) that exercise the shared modules end-to-end.

Enjoy building across browser and mobile with a single, cohesive workspace! If you add new shared utilities, document them in `shared/README.md` and update the table above so every platform stays aligned.
=======
For major changes, please open an issue first to discuss the proposed changes.
>>>>>>> b1718923ca32fe5b9debe28414d3f8bb55644c86
