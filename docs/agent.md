# Agent Handoff

## Purpose
This file is a compact handoff for future agents working in this repository. It summarizes what has already been done in this chat, how the app is currently structured, and the working style that has been used so far.

## Project Overview
PokeDex AI Project is a local-only Express Pokedex app.

Current stack:
- Node.js
- Express
- express-session
- Passport with Google strategy
- MongoDB via Mongoose
- connect-mongo for session storage
- EJS views
- PokeAPI for Pokemon data
- axios for API requests

## Current Repository Layout
The live repo currently includes:
- `server.js`
- `config/passport.js`
- `middleware/ensureAuthenticated.js`
- `models/User.js`
- `models/Favorite.js`
- `routes/auth.js`
- `routes/favorites.js`
- `routes/pokedex.js`
- `services/pokeapi.js`
- `views/home.ejs`
- `views/index.ejs`
- `views/pokemon.ejs`
- `views/favorites/index.ejs`
- `views/partials/header.ejs`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/REVIEW.md`
- `CLAUDE.md`
- `.env`
- `.env.example`

## What Has Been Done In This Chat
### Docs
- Created `docs/PRODUCT.md` as a product-only description with no implementation details.
- Created and then corrected `docs/ARCHITECTURE.md` so it matches the actual repository structure.
- Added `docs/REVIEW.md` to capture the security and correctness findings for later follow-up.

### App Bootstrap
- Added `server.js` as the main entry point.
- `server.js` loads dotenv.
- `server.js` connects to MongoDB using `MONGODB_URI`.
- `server.js` sets EJS as the view engine.
- `server.js` serves the public directory statically.
- `server.js` initializes express-session with a Mongo-backed store using connect-mongo.
- `server.js` mounts Passport and the current app routes.

### Passport and Auth
- Added `config/passport.js` with GoogleStrategy.
- The Google strategy reads `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_CALLBACK_URL` from env.
- On login, the app finds or creates a `User` by `googleId`.
- `serializeUser` stores the Mongo user id.
- `deserializeUser` loads the user back by id.
- Added `routes/auth.js` for Google login and logout.
- Added `middleware/ensureAuthenticated.js` to redirect unauthenticated users to `/`.

### Pokedex and Pokemon Views
- Added `services/pokeapi.js` using axios.
- Implemented `getPokemonList({ limit, offset })`.
- Implemented `getPokemonByName(name)` returning normalized Pokemon data.
- Added `routes/pokedex.js` for public browsing and detail pages.
- Added `views/index.ejs` for the Pokemon list.
- Added `views/pokemon.ejs` for Pokemon details.

### Favorites Feature
- Added `models/Favorite.js` for saved Pokemon.
- Added `routes/favorites.js` for listing, saving, and removing favorites.
- Added `views/favorites/index.ejs` for the favorites page.
- Added favorite actions to `views/pokemon.ejs`.
- Added a Favorites link to the shared header.
- Added a Home link to the shared header.

### Shared Views
- Added `views/home.ejs`.
- Added `views/partials/header.ejs`.
- The app uses the header partial to show sign-in state and navigation.

## Review Findings Captured So Far
These were captured in `docs/REVIEW.md` and should be treated as open follow-up items.

- Favorites removal uses `req.get('referer')` as a redirect target, which is an open redirect risk.
- `GOOGLE_CALLBACK_URL` is only checked for presence, not validated for expected format or origin.

## Important Behavior Details
- Google sign-in is the only auth path.
- No password login exists.
- `GOOGLE_CLIENT_SECRET` and `SESSION_SECRET` are only read from the environment.
- Session storage is Mongo-backed.
- Protected favorites routes are behind `ensureAuthenticated`.
- Public Pokemon browsing does not require login.

## How Work Has Been Done In This Chat
The preferred working style in this repo has been:
- make the smallest useful change that matches the request
- keep docs aligned with the actual file tree
- validate each file after editing
- prefer direct implementation over speculative refactors
- keep explanations concise and practical
- update shared docs when behavior or structure changes

## Style And Collaboration Preferences To Preserve
When working here, continue to:
- keep changes narrowly scoped
- avoid adding implementation logic when the request is only for scaffolding or documentation
- keep architecture and docs in sync with the actual repository
- use environment variables for secrets and runtime config
- preserve the current Google auth approach unless explicitly asked to change it
- keep responses concise and factual
- prefer file-level summaries and direct next steps over long prose

## Suggested Next Step For Future Agents
Before making new changes, check:
- `docs/ARCHITECTURE.md`
- `docs/REVIEW.md`
- `server.js`
- `routes/favorites.js`
- `config/passport.js`

Those files capture most of the current app behavior and the open review items.
