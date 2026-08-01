# CLAUDE.md

Guidance for working in the **windchimes** frontend.

## What this is

A cross-platform music player that **aggregates music from other platforms** (currently
YouTube and SoundCloud) into one app. It solves two problems:

- Listen to YouTube-exclusive podcasts and SoundCloud-exclusive records in a single place,
  without constant platform switching.
- Ad-free, subscription-free playback.

It's a **Vue 3 + Capacitor** app (web + Android) that talks to a separate backend over
**GraphQL**. **Vuetify** is the base UI layer.

### Project status: maintenance mode

The platform is in maintenance mode. **Bugfixes and small features are welcome; avoid large
architectural changes or refactors** unless explicitly requested.

## Tech stack

- **Vue 3** (Composition API, `<script setup>`) + **Vue Router**
- **Pinia** for global state
- **Vuetify 3** UI
- **Apollo Client** (`@vue/apollo-composable`) for GraphQL, with **graphql-codegen** typed operations
- **Auth0** (`@auth0/auth0-vue`) for auth
- **Capacitor 6** for the Android app (media session, haptics, browser, app plugins)
- **hls.js** for HTTP Live Streaming playback
- **vee-validate** + **zod** for form validation
- **@vueuse/core** for reactive utilities (heavily used, esp. localStorage)
- Tests: **Cypress** (e2e), **Storybook** + **Vitest** (component/browser via Playwright)

## Architecture: Feature-Sliced Design (FSD)

The `src/` tree follows [Feature-Sliced Design](https://feature-sliced.design). Layers, from
highest to lowest:

```
app → pages → widgets → features → entities → shared
```

- **`app/`** — composition root: app bootstrap (`main.ts` imports from here), Apollo/Auth0/
  Vuetify/router config (`app/config/`), global App shell + app bar (`app/ui/`), fatal-error store.
- **`pages/`** — route-level views (`home`, `search`, `playlist`, plus `auth-callback` and
  `not-found`). Routes are declared in `app/config/router.ts` (all eagerly imported).
- **`widgets/`** — large composite UI blocks (player toolbar, playlists board, tracks-queue
  editor, preferences drawer, notifications queue…).
- **`features/`** — user interactions / capabilities (`player`, `sync`, `search-menu`,
  `playlist-actions`, `theme-toggle-buttons`…).
- **`entities/`** — domain models and their API/UI (`tracks`, `tracks-queue`, `playlists`,
  `platform`, `preferences`, `tracks-import-form-dialog`).
- **`shared/`** — cross-cutting building blocks: reusable UI (`shared/ui/`), utils
  (`shared/utils/`), generated GraphQL types + models (`shared/model/`), API fragments
  (`shared/api/`), config.

Conventions:

- **Import direction goes downward only** (a layer imports from layers below it, never above).
- Each slice exposes a **public API via `index.ts`**; import from the slice root
  (`@/features/player`) rather than reaching into internal files. Inside a slice, files are
  grouped into `model/` (stores, logic, types), `api/` (GraphQL), and `ui/` (components).
- `steiger` (FSD linter) is installed but **boundaries are treated loosely / aspirationally** —
  follow the structure by convention; don't obsess over strict lint rules.
- `@` is aliased to `src/` (see `vite.config.ts` / `tsconfig.json`).

### GraphQL error handling pattern (important)

The backend models expected/business errors as a **`GraphQLApiError` union member**, not as
transport errors. Queries/mutations select `... on GraphQLApiError { ...Error }` using the
shared `ERROR_FRAGMENT` (`shared/api/error-fragment.ts`). So callers must **check
`__typename`** on results (e.g. `TrackAudioFileGraphQL` vs `GraphQLApiError`) before using data.

Helpers in `shared/utils/graphql.ts`:

- `useMutationWithErrorNotification` — wraps `useMutation` and shows a toast on transport error.
- `ExcludeGraphQLError<T>` — narrows a union result away from the error member.
- `IgnoreTypename<T>` — cast escape hatch when `__typename` mismatch is irrelevant (use sparingly).

## Player & audio (core domain)

The playback engine is the heart of the app. Three cooperating pieces:

- **`shared/utils/audio.ts` → `useAudio()`** — low-level reactive wrapper around a single
  `HTMLAudioElement`. Owns play/pause/rewind, exposes reactive `paused` / `currentSecond` /
  `mediaLoadError`, and **synchronizes the browser/native [Media Session]** (lock-screen &
  notification controls, next/prev/seek handlers, position state). Audio must be initialized
  with `initializeAudio()` before use, or methods throw `AudioNotInitializedError`.
- **`features/player` → `usePlayerStore`** — orchestrates playback on top of the queue:
  `play`, `pause`, `rewind`, next/prev, and **loop modes** (`LoopMode`: Disabled →
  LoopCurrentTrack → LoopPlaylist, cycled by `toggleLoopMode`, persisted to localStorage).
- **`entities/tracks-queue` → `useTracksQueueStore`** — the queue itself and track navigation.

Key behaviors to preserve:

- **HLS vs direct audio:** platforms in `PLATFORMS_TO_PLAY_AS_HLS` (currently **YouTube**) only
  serve `*.m3u8` and are played through **hls.js**; others get a direct `src`. See `playAudio`'s
  `playAsHls` flag and `player-store.ts`.
- **Lazy track loading:** queue items may be unresolved `TrackReference`s. `playItemFromQueue`
  resolves them to `LoadedTrackGraphQL` and fetches a fresh **audio-file URL** on demand
  (`queryLoadedTrack` + `queryTrackAudioFile`), then caches the loaded track back into the queue.
- **Error-skip:** if a track fails to load, `playNextTrack`/`playPreviousTrack` **auto-skip in
  the same direction** (incrementing `tracksToSkipCount`) until a playable track or a
  `TracksQueueBoundsReachedError`. Preserve this self-healing behavior.
- `initializePlayer()` (`features/player/utils`) restores the last-played track on startup
  (paused) from persisted state.

## Error handling & notifications

- **Fatal errors** → `shared/model/errors.ts` (`FatalError`, `NotFoundError`). `main.ts` wires
  `app.config.errorHandler` to `useFatalErrorStore().handleError`, which routes to an error
  page; `router.afterEach` clears it on navigation.
- **Transient errors** → `showTemporaryNotification('error', …)` (`shared/utils/notifications.ts`),
  rendered by the `notifications-queue` widget. This is the standard way to surface recoverable
  failures (media load errors, mutation errors, etc.).
