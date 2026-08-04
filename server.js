require('dotenv').config();

const express = require('express');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const configurePassport = require('./config/passport');
const authRoutes = require('./routes/auth');
const pokedexRoutes = require('./routes/pokedex');

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;
const sessionSecret = process.env.SESSION_SECRET;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

async function startServer() {
  if (!mongoUri) {
    console.error('MONGODB_URI is not set');
    process.exit(1);
  }

  if (!sessionSecret) {
    console.error('SESSION_SECRET is not set');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    configurePassport();

    app.use(
      session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
          mongoUrl: mongoUri,
        }),
      })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    app.use((req, res, next) => {
      res.locals.user = req.user || null;
      next();
    });

    app.use('/', pokedexRoutes);
    app.use('/auth', authRoutes);

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error('Application startup failed:', error.message);
    process.exit(1);
  }
}

startServer();