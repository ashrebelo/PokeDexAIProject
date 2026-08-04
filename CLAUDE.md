# CLAUDE.md

This file is the working guide for the PokeDex AI Project.

## Stack
- Node.js 20 LTS
- Express 4.x
- express-session 1.x
- Passport 0.7.x
- passport-local 1.x
- Mongoose 8.x
- connect-mongo 5.x
- EJS 3.x
- MongoDB (local instance)
- PokeAPI as the external Pokémon data source

## Project Structure
The repo is expected to follow the architecture defined in `docs/ARCHITECTURE.md`.

```text
PokeDexAIProject/
  app.js
  package.json
  .env
  .env.example
  docs/
    PRODUCT.md
    ARCHITECTURE.md
  config/
    db.js
    passport.js
    session.js
  models/
    User.js
    Favorite.js
  routes/
    index.js
    auth.js
    pokemon.js
    favorites.js
  controllers/
    authController.js
    pokemonController.js
    favoriteController.js
  services/
    pokeapi.js
  middleware/
    ensureAuthenticated.js
    attachCurrentUser.js
  views/
    layout.ejs
    home.ejs
    auth/
      login.ejs
      register.ejs
    pokemon/
      index.ejs
      show.ejs
    favorites/
      index.ejs
    partials/
      header.ejs
      footer.ejs
      flash.ejs
  public/
    css/
    js/
    images/
```

## Local Run
1. Install dependencies.
   ```bash
   npm install
   ```
2. Create a local `.env` file from `.env.example`.
3. Fill in the required local configuration values in `.env`.
4. Start the app with the project script when available, or run the main server entry point directly during early setup.

## Environment Convention
All runtime configuration must live in `.env`.

- `.env` is for local, machine-specific values only.
- `.env.example` is the template and should document every required variable without secrets.
- Do not hard-code configuration values in source files when they belong in environment variables.
- If a setting is needed at runtime, it should be read from `.env`.

## Working Rules
- Keep public browsing separate from authenticated favorites management.
- Treat PokeAPI as a read-only external dependency.
- Keep user sessions in MongoDB through `connect-mongo`.
- Preserve the server-rendered EJS flow for the user interface.
