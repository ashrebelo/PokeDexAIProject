(Review notes captured on 2026-08-04)

# Review Findings

## High Priority

### Open redirect via favorites removal
The favorites removal handler redirects to `req.get('referer')` when the delete completes. That value comes from a request header and can be spoofed, which makes the endpoint vulnerable to open redirect behavior.

- Location: [routes/favorites.js](../routes/favorites.js#L68)
- Impact: a malicious `Referer` header can steer the browser to an unexpected external URL after removing a favorite.

## Medium Priority

### OAuth callback URL is not validated
The Google OAuth setup reads `GOOGLE_CALLBACK_URL` from the environment and checks that it exists, but it does not validate the format or constrain it to the expected local callback path before passing it to Passport.

- Location: [config/passport.js](../config/passport.js#L10)
- Impact: a misconfigured environment value could silently send OAuth to the wrong callback URL.

## Confirmed Correct Behaviors

- `GOOGLE_CLIENT_SECRET` is only read from the environment and not hard-coded.
- `SESSION_SECRET` is only read from the environment and not hard-coded.
- The session store is Mongo-backed through `connect-mongo`.
- Protected favorites routes are behind `ensureAuthenticated`.

## Follow-up

If you revisit this later, the first two items to fix are the redirect target in `routes/favorites.js` and the callback URL validation in `config/passport.js`.
