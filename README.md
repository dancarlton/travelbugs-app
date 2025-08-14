# TravelBugs — Mobile App (Expo + TypeScript)

Map-based exploration game. Visit landmarks → collect stamps → earn badges.
MVP first: Onboarding → Explore map → Proximity detection → Stamp → Celebrate → “Next up”.

## Tech

- Expo (Managed) + React Native + TypeScript (strict)
- React Query (server state), Zod (validation)
- Supabase Auth + DB
- Reanimated / Moti / Lottie (animations)
- ESLint + Prettier + Husky

## Quick Start

```
pnpm install
pnpm expo prebuild
pnpm dev
```

## Environment

Create `.env` in the project root:

```
EXPO_PUBLIC_SUPABASE_URL=your-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Scripts

```
pnpm dev          # expo start
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
pnpm format       # prettier -w
```

## Project Structure

```
travelbugs-app/
app/                         # Expo Router only (tiny wrappers)
  (auth)/
    sign-in.tsx              # imports from src/features/auth
  (tabs)/
    _layout.tsx
    explore.tsx              # imports from src/features/explore
    badges.tsx               # imports from src/features/badges (future)
    profile.tsx              # imports from src/features/profile
src/
  features/
    explore/
      components/
      hooks/
      lib/                   # helpers for this feature
      screens/
        ExploreScreen.tsx    # your current explore screen (moved)
      types.ts
      index.ts               # barrel (re-exports ExploreScreen)
    auth/
      screens/
        SignInScreen.tsx
      hooks/
      lib/
      index.ts
    profile/
      screens/
        ProfileScreen.tsx
      index.ts
    pois/                    # new feature we’ll use next
      data/                  # mock JSON/TS for local POIs
      components/
      hooks/
      lib/
      screens/
        PoiDebugScreen.tsx   # optional, for testing
      index.ts
  components/                # truly shared, cross-feature UI
  hooks/                     # cross-feature hooks
  lib/                       # cross-feature utilities (api, supabase, etc.)
  assets/                    # images, Lottie, etc. (if not using /assets at root)
  styles/                    # theme/tokens if you want
  utils/                     # misc helpers (or merge into lib/)
```

## Build & OTA

```
eas init
eas build --platform ios
eas build --platform android
eas update --branch production --message "OTA: MVP"
```

> Stay in Expo Managed for MVP. No Redux. Ship the loop.
