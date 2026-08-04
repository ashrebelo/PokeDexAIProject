const express = require('express');
const passport = require('passport');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

const router = express.Router();

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});

router.get('/logout', ensureAuthenticated, (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }

    return res.redirect('/');
  });
});

module.exports = router;