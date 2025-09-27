# Manage – Productivity Extension & GraphQL Platform

Manage is a Chrome-powered productivity hub with a Gemini-assisted dashboard, GraphQL sync pipeline, and a mobile companion (maintained in a separate repository). The extension now ships with an onboarded landing experience, Firebase-aware authentication, and health checks that keep local demo mode stable even when credentials are missing.

## 🧭 Repository layout

```
.
├── extension/          # Chrome extension (Vite + React + Tailwind)
├── packages/api/       # Node GraphQL prototype wired to shared helpers
├── shared/             # Firebase, Gemini, and TypeScript primitives reused everywhere
└── README.md
```

> The React Native client lives in its own repository. This workspace focuses on the extension, shared libraries, and backend prototype.

## ✅ Quick-start checklist

1. **Install dependencies**
   ```bash
   cd extension
   npm install
   ```

2. **Provide environment variables** (skip for demo mode)
   ```bash
   cp extension/.env.example extension/.env
   # Fill in Firebase + Gemini keys when available
   ```

3. **Build the packed extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Open `chrome://extensions`
   - Enable *Developer mode*
   - Click *Load unpacked* → select `extension/dist`

5. **Preview the landing experience**
   - Open a new tab; the Manage landing page appears until onboarding is completed
   - Sign in / sign up once Firebase is configured, or choose “Explore dashboard preview” to continue without credentials

6. **Run the backend prototype (optional)**
   ```bash
   cd packages/api
   npm install
   npm run dev
   ```

## ✨ Highlights in this iteration

- **Landing page integration** – The marketing site from the design prototype now renders inside the extension new tab, with a condensed CTA surfaced in the popup.
- **Onboarding state** – `hasCompletedOnboarding` is persisted so users can revisit the dashboard after completing or skipping the landing flow.
- **Firebase health checks** – The landing diagnostics card exercises Auth + Firestore connectivity via `testFirebaseConnection()`.
- **Guarded authentication** – Firebase initialisation is optional. Auth UI communicates readiness and disables sign-in buttons until credentials exist. Successful sign-up/login automatically provisions a Firestore profile document.
- **Reusable profile service** – `profileService.ts` keeps user documents up to date with `lastLoginAt` and display metadata.

## 🧩 Extension architecture

| Area | Key files | Notes |
| --- | --- | --- |
| Landing & onboarding | `extension/src/components/LandingPage.tsx`, `extension/src/newtab/App.tsx`, `extension/src/popup/PopupApp.tsx` | Landing page shows before login; popup links back to it. |
| Dashboard | `extension/src/components/*`, `extension/src/store/appStore.ts` | Tasks, notes, AI suggestions reuse Zustand store + Tailwind UI. |
| Auth & profiles | `extension/src/services/authService.ts`, `extension/src/services/profileService.ts`, `shared/firebase` | Graceful fallback when Firebase is absent; Firestore profile auto-created. |
| Connectivity | `extension/src/services/connectionTest.ts` | Health check feeds the landing diagnostics card. |
| Shared utilities | `shared/utils/env.ts`, `shared/types` | Path alias `@shared/*` resolves via Vite + TypeScript config. |

## 🔐 Environment variables

| Variable | Purpose | Notes |
| --- | --- | --- |
| `FIREBASE_API_KEY` / `VITE_FIREBASE_API_KEY` | Firebase web key | Required for production auth; optional locally. |
| `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_APP_ID` | Standard Firebase config | All six keys supported. |
| `GEMINI_API_KEY` / `VITE_GEMINI_API_KEY` | Gemini server fallback | Used when on-device Gemini Nano isn’t available. |
| `API_BASE_URL` / `VITE_API_BASE_URL` | GraphQL endpoint | Default: `http://localhost:4000/graphql`. |

> Without `.env` the extension runs in demo mode: local features remain available, authentication is disabled, and the landing page warns you about the missing credentials.

## 🧪 Validation commands

```bash
# From /extension
npm run build        # Vite production build + manifest packaging
npm run lint         # optional TypeScript/ESLint pass
npm run type-check   # strict TypeScript validation
```

The build step writes `dist/manifest.json` with a module-based service worker entry so Chrome accepts ES module syntax.

## 📚 Additional resources

- `extension/TASKS.md` – running backlog and integration notes
- `shared/README.md` – documentation for cross-platform helpers
- `packages/api/README.md` – instructions for the GraphQL/Prisma playground

## 🚀 Roadmap highlights

- Wire up Apollo Client for GraphQL sync across extension + mobile
- Implement optimistic task/note mutations with conflict resolution
- Add vector embedding workers for note RAG + Gemini prompts
- Ship CI/CD: Docker image + GitHub Actions workflow (backend) and automated extension packaging

Enjoy the new onboarding flow! If you spot anything that prevents local setup, open an issue or drop a note in `TASKS.md`.<<<<<<< HEAD
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
````markdown
# Manage – Productivity Extension & GraphQL Platform

Manage is a Chrome-powered productivity hub with a Gemini-assisted dashboard, GraphQL sync pipeline, and a mobile companion (maintained in a separate repository). This monorepo now ships a polished public landing experience, streamlined onboarding, and graceful fallbacks when Firebase credentials are missing.

## 🧭 Repository layout

```
.
├── extension/          # Chrome extension (Vite + React + Tailwind)
├── packages/api/       # Node GraphQL prototype wired to shared helpers
├── shared/             # Firebase, Gemini, and TypeScript primitives reused everywhere
└── README.md
```

> The React Native client lives in its own repository. This workspace focuses on the extension, shared libraries, and backend prototype.

## ✅ Quick-start checklist

1. **Install dependencies**
	```bash
	cd extension
	npm install
	```

2. **Provide environment variables** (skip for demo mode)
	```bash
	cp extension/.env.example extension/.env
	# Fill in Firebase + Gemini keys when available
	```

3. **Build the packed extension**
	```bash
	npm run build
	```

4. **Load in Chrome**
	- Open `chrome://extensions`
	- Enable *Developer mode*
	- Click *Load unpacked* → select `extension/dist`

5. **Preview the landing experience**
	- Open a new tab; the Manage landing page appears until onboarding is completed
	- Sign in / sign up once Firebase is configured, or choose “Explore dashboard preview” to continue without credentials

6. **Run the backend prototype (optional)**
	```bash
	cd packages/api
	npm install
	npm run dev
	```

## ✨ What’s new in this iteration?

- **Landing page integration** – The marketing site from the design prototype is now part of the extension. It renders inside the new tab experience and inside the popup (as a condensed CTA) for first-time users.
- **Onboarding state** – `hasCompletedOnboarding` is persisted across sessions so users can revisit the dashboard after opting in or skipping the landing flow.
- **Firebase health checks** – The landing page includes a diagnostics widget that exercises Auth + Firestore connectivity via `testFirebaseConnection()`.
- **Guarded authentication** – Firebase initialisation no longer crashes when `.env` is missing. Auth UI clearly communicates readiness and disables sign-in buttons until credentials are supplied. Successful sign-up/login automatically provisions a Firestore profile document.
- **Reusable profile service** – `profileService.ts` keeps user documents up to date with `lastLoginAt` and display metadata.

## 🧩 Extension architecture

| Area | Key files | Notes |
| --- | --- | --- |
| Landing & onboarding | `src/components/LandingPage.tsx`, `src/newtab/App.tsx`, `src/popup/PopupApp.tsx` | Landing page shows before login; popup links back to it. |
| Dashboard | `src/components/*`, `src/store/appStore.ts` | Tasks, notes, AI suggestions reuse Zustand store + Tailwind UI. |
| Auth & profiles | `src/services/authService.ts`, `src/services/profileService.ts`, `shared/firebase` | Graceful fallback when Firebase missing; Firestore profile auto-created. |
| Connectivity | `src/services/connectionTest.ts` | Health check feeds the landing diagnostics card. |
| Shared utilities | `shared/utils/env.ts`, `shared/types` | Path alias `@shared/*` resolves via Vite + TypeScript config. |

## 🔐 Environment variables

| Variable | Purpose | Notes |
| --- | --- | --- |
| `FIREBASE_API_KEY` / `VITE_FIREBASE_API_KEY` | Firebase web key | Required for production auth; optional locally. |
| `FIREBASE_AUTH_DOMAIN` etc. | Standard Firebase config | All six core keys supported (API key, auth domain, project id, storage bucket, sender id, app id). |
| `GEMINI_API_KEY` / `VITE_GEMINI_API_KEY` | Gemini server fallback | Used when on-device Gemini Nano isn’t available. |
| `API_BASE_URL` / `VITE_API_BASE_URL` | GraphQL endpoint | Default: `http://localhost:4000/graphql`. |

> When `.env` is absent the extension runs in an offline demo mode – the landing page warns you, auth is disabled, but local storage features remain available.

## 🧪 Validation commands

```bash
# From /extension
npm run build        # type-check + Vite production build + manifest packaging
npm run lint         # optional: keep TS/JS tidy
npm run type-check   # strict TypeScript validation
```

The build step automatically writes `dist/manifest.json` with the proper module-based service worker entry.

## 📚 Additional resources

- `extension/TASKS.md` – running backlog and integration notes
- `shared/README.md` – documentation for cross-platform helpers
- `packages/api/README.md` – instructions for the GraphQL/Prisma playground

## 🚀 Roadmap highlights

- Wire up Apollo Client for GraphQL sync across extension + mobile
- Implement optimistic task/note mutations with conflict resolution
- Add vector embedding workers for note RAG + Gemini prompts
- Ship CI/CD: Docker image + GitHub Actions workflow (backend) and automated extension packaging

Enjoy the new onboarding flow! If you spot anything that prevents local setup, open an issue or drop a note in `TASKS.md`.
````
## Development Tips
