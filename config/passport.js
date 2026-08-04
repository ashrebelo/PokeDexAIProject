const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const User = require('../models/User');

function configurePassport() {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackURL = process.env.GOOGLE_CALLBACK_URL;

  if (!clientID || !clientSecret || !callbackURL) {
    throw new Error('Google OAuth environment variables are not fully set');
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const googleId = profile.id;
          const displayName = profile.displayName || '';
          const email = profile.emails?.[0]?.value || '';

          let user = await User.findOne({ googleId });

          if (!user) {
            user = await User.create({
              googleId,
              displayName,
              email,
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

module.exports = configurePassport;