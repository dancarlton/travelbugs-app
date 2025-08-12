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

## Minimal Structure

```
src/
  components/
  features/
    explore/      # map + bottom sheet + proximity
    stamp/        # stamp button + celebration
  hooks/
  lib/
    supabase.ts
    queryClient.ts
  types/
app/              # Expo Router or navigation root
```

## Build & OTA

```
eas init
eas build --platform ios
eas build --platform android
eas update --branch production --message "OTA: MVP"
```

> Stay in Expo Managed for MVP. No Redux. Ship the loop.
