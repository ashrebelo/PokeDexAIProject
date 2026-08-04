# PokeDex AI Project Architecture Draft

## Purpose
This document proposes the initial application architecture for the local-only PokeDex AI Project. It is intended for review before implementation begins and reflects the product scope defined in `docs/PRODUCT.md`.

The application is a server-rendered Express Pokédex that allows anonymous browsing, user registration and login, and account-specific favorite management. Pokémon data is sourced from PokeAPI, while user accounts, favorites, and session state are stored in MongoDB.

## Architectural Goals
- Keep the application simple to develop, review, and maintain.
- Separate public browsing from authenticated user actions.
- Preserve user-specific favorites across sessions.
- Keep external data access isolated from request-handling code.
- Support a clean server-rendered user experience with EJS.

## System Overview
The application consists of the following major concerns:
- Express handles HTTP routing and page rendering.
- EJS renders the user interface on the server.
- Passport with a local strategy handles authentication.
- express-session stores login state for the current user.
- connect-mongo persists session data in MongoDB.
- Mongoose manages application data models.
- PokeAPI provides Pokémon catalog and detail data.

## Proposed Folder Structure
The structure below is intended to keep feature logic separated while remaining lightweight.

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

### Folder Responsibilities
- `app.js` initializes the Express application and registers middleware, routes, and view configuration.
- `.env` stores local runtime secrets and configuration values.
- `.env.example` documents the expected environment variables without real secrets.
- `config/` contains environment-specific setup for MongoDB, Passport, and sessions.
- `models/` contains the Mongoose schemas used by the application.
- `routes/` defines URL structure and maps requests to controllers.
- `controllers/` contains request-handling logic for each feature area.
- `services/` encapsulates external API access, especially PokeAPI requests.
- `middleware/` contains reusable request guards and user-loading helpers.
- `views/` contains the server-rendered user interface.
- `public/` contains static assets.

## Data Model Proposal

### User
The `User` model represents a registered account.

Primary responsibilities:
- store account identity
- support authentication
- associate favorites with the correct person

Proposed fields:
- `username`
- `passwordHash`
- `createdAt`
- `updatedAt`

Expected behavior:
- usernames are unique
- passwords are stored securely as hashes, not plain text
- each user account is independent of other user accounts

### Favorite
The `Favorite` model represents a Pokémon saved by a user.

Primary responsibilities:
- link a user to a saved Pokémon
- preserve a snapshot of the Pokémon information needed for the favorites view
- support retrieval and removal of saved items

Proposed fields:
- `userId`
- `pokemonId`
- `name`
- `spriteUrl`
- `types`
- `savedAt`

Expected behavior:
- a favorite belongs to exactly one user
- a user can save the same Pokémon only once
- favorites remain available when the user returns later

### Data Model Notes
A separate `Favorite` collection is preferred over embedding favorites inside the `User` document. This keeps the account model focused on authentication and makes favorite queries, display, and removal more straightforward.

## Routing Plan

### Public Routes
These routes are available without authentication.

- `GET /`
- `GET /pokemon`
- `GET /pokemon/:id`

Purpose:
- present the landing page
- show the Pokémon catalog
- show a detailed Pokémon view

### Authentication Routes
These routes support account creation and login state.

- `GET /register`
- `POST /register`
- `GET /login`
- `POST /login`
- `POST /logout`

Purpose:
- allow a new user to create an account
- allow an existing user to sign in
- allow a signed-in user to sign out

### Favorites Routes
These routes are only available to authenticated users.

- `GET /favorites`
- `POST /favorites/:pokemonId`
- `DELETE /favorites/:pokemonId`

Purpose:
- show the current user’s saved favorites
- save a Pokémon to the current user’s account
- remove a saved Pokémon from the current user’s account

### Route Behavior Expectations
- Anonymous users can browse Pokémon and view details.
- Anonymous users are redirected to login when they attempt to manage favorites.
- Authenticated users can access their own favorites only.
- The application should preserve the user’s intended destination when possible after login.

## Authentication and Session Design

### Authentication Model
The application uses session-based authentication with Passport’s local strategy. A user submits a username and password, and the server validates the credentials against the stored account record.

On successful authentication:
- Passport establishes the user identity for the session
- the browser receives a session cookie
- subsequent requests are associated with the authenticated user

### Session Storage
Sessions are stored in MongoDB using `connect-mongo`.

This approach is intended to:
- keep login state available across requests
- persist sessions across server restarts during local use
- avoid storing session data only in server memory

### Login Flow
1. The user submits login credentials.
2. The credentials are validated.
3. On success, the session is created.
4. The user is redirected into the authenticated experience.

### Logout Flow
1. The user submits a logout request.
2. The session is cleared.
3. The browser returns to an unauthenticated state.

### Access Control Rules
- Public browsing routes do not require authentication.
- Favorites routes require a signed-in user.
- Authentication pages should not force unnecessary access barriers.
- The current user should be available to views for conditional rendering.

## External Data Access
PokeAPI is the source of Pokémon data for browsing and detail views.

The application should treat PokeAPI as a read-only external dependency and keep that access behind a service layer. This keeps the rest of the application from depending directly on request details from the external API.

The local environment should define application settings through environment variables rather than hard-coded values. The exact variable names can be finalized during implementation, but the architecture should assume a dedicated `.env` file for local use and a matching `.env.example` file for documentation.

Expected responsibilities of the data access layer:
- fetch lists of Pokémon
- fetch details for a selected Pokémon
- normalize response data into a shape the views can use consistently

## View Structure
The application uses EJS to render pages on the server.

The view layer should support:
- a consistent layout
- navigation that reflects signed-in or signed-out state
- dedicated pages for browsing, details, login, registration, and favorites
- reusable partials for repeated interface elements

## Request Flow Summary
A typical request path should follow this pattern:
- the user requests a page
- Express routes the request
- middleware applies session and user context
- controllers coordinate the response
- services fetch Pokémon data if needed
- Mongoose reads or writes account and favorite data
- EJS renders the final page

## Proposed Implementation Boundaries
This architecture intentionally limits scope to the following concerns:
- account creation and login
- Pokémon browsing and details
- account-specific favorites
- local persistence through MongoDB
- server-rendered pages

It does not currently include:
- battles
- trading
- social features
- public sharing of favorites
- advanced search beyond the initial Pokédex experience

## Review Questions
The following points should be confirmed before implementation:
- Should favorites store a snapshot of Pokémon details, or only the Pokémon identifier?
- Should browsing include pagination in the first version?
- Should the login experience redirect back to the page the user originally requested?
- Should the app show favorite state directly on the Pokémon detail page?

## Architecture Summary
This proposal defines a straightforward Express application with clear separation between routing, authentication, persistence, and external API access. The design favors maintainability and user-account isolation while staying narrow enough for a local-only product.
