# Shared Workspace

This workspace contains cross-platform modules that are consumed by the Chrome extension and the mobile application.

## Provided Modules

- `firebase/`: Lightweight wrappers around the Firebase Web SDK with safe, idempotent initialization helpers and collection constants.
- `ai/`: Gemini (Google AI) client helpers with shared prompt utilities.
- `types/`: Canonical TypeScript types used across workspaces.
- `utils/env.ts`: Environment helpers that normalise configuration for all runtimes (Vite, Expo, Node).

## Usage

Import modules using the `@shared/*` alias from any workspace:

```ts
import { initializeFirebase } from '@shared/firebase';
import type { Task } from '@shared/types';
```

Update the relevant workspace `.env` file before initialising Firebase or Gemini services. The helper functions look for both prefixed (`VITE_*`) and unprefixed keys to simplify configuration.
