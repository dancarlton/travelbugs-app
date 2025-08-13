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
├─ app/                         # expo-router routes
│  ├─ _layout.tsx               # providers + tabs
│  ├─ (auth)/                   # unauthenticated stack
│  │  ├─ _layout.tsx
│  │  ├─ sign-in.tsx
│  │  └─ onboarding.tsx
│  ├─ (tabs)/                   # authenticated tabs
│  │  ├─ _layout.tsx
│  │  ├─ explore.tsx            # Map + bottom sheet
│  │  ├─ quests.tsx             # MVP: “Zones” list (read-only)
│  │  ├─ progress.tsx           # Stamps/Badges progress
│  │  └─ profile.tsx
│  ├─ landmark/[id].tsx         # Landmark detail + Stamp CTA
│  └─ zone/[id].tsx             # Zone overview + Next-up
│
├─ src/
│  ├─ app-providers/            # global providers
│  │  ├─ QueryProvider.tsx
│  │  ├─ SupabaseProvider.tsx
│  │  └─ ThemeProvider.tsx
│  ├─ features/
│  │  ├─ auth/
│  │  │  ├─ api.ts              # supabase auth calls
│  │  │  ├─ hooks.ts            # useUser()
│  │  │  └─ schema.ts           # zod for inputs
│  │  ├─ landmarks/
│  │  │  ├─ api.ts              # list landmarks, byId
│  │  │  ├─ hooks.ts            # useLandmarksNearby(), useLandmark()
│  │  │  ├─ model.ts            # TS types (from generated Supabase)
│  │  │  └─ proximity.ts        # distance calc + thresholds
│  │  ├─ stamps/
│  │  │  ├─ api.ts              # create stamp
│  │  │  └─ hooks.ts            # useStampMutation()
│  │  ├─ badges/
│  │  │  ├─ api.ts              # get badge progress
│  │  │  └─ hooks.ts
│  │  └─ zones/
│  │     ├─ api.ts              # list zones, zone detail
│  │     └─ hooks.ts
│  ├─ components/
│  │  ├─ map/ExploreMap.tsx     # MapView + markers + camera control
│  │  ├─ sheets/LandmarkSheet.tsx
│  │  ├─ ui/                     # design system (buttons, cards)
│  │  │  ├─ Button.tsx
│  │  │  ├─ Card.tsx
│  │  │  └─ Icon.tsx
│  │  ├─ feedback/Celebration.tsx # Lottie confetti + haptics
│  │  └─ StampButton.tsx
│  ├─ hooks/
│  │  ├─ useLocationLive.ts     # foreground location + heading
│  │  └─ useProximity.ts        # ties location -> active stampable landmark
│  ├─ lib/
│  │  ├─ supabase.ts            # supabase client
│  │  ├─ queryKeys.ts           # react-query keys
│  │  └─ haversine.ts           # distance utility
│  ├─ state/
│  │  └─ uiStore.ts             # lightweight UI state (if needed)
│  ├─ styles/
│  │  ├─ theme.ts
│  │  └─ tokens.ts
│  └─ types/
│     ├─ supabase.generated.ts  # generated types
│     └─ domain.ts              # shared domain-facing types
│
├─ .eslintrc.cjs
├─ .prettierrc
├─ tsconfig.json
└─ package.json
```

## Build & OTA

```
eas init
eas build --platform ios
eas build --platform android
eas update --branch production --message "OTA: MVP"
```

> Stay in Expo Managed for MVP. No Redux. Ship the loop.
