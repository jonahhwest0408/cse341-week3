const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user'); // Assuming you have a user model

// Configure Passport to use Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }

      const newUser = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
      });
      await newUser.save();
      done(null, newUser);
    } catch (err) {
      done(err, false);
    }
  }
));

// Serialize user data to store in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user data to retrieve from session
passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);  // Use await to fetch the user
      done(null, user);  // Pass the user object to the done callback
    } catch (err) {
      done(err, null);  // Pass the error to done if an error occurs
    }
  });
