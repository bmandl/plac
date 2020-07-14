const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

const UserAuth = (() => {
  passport.use(new LocalStrategy( // definition for local authenticate strategy
    async (username, password, done) => {
      try {
        const user = await User.find(username);
        if (!user) return done(null, false, { message: 'Incorrect username' });
        if (!user.validPassword(password)) return done(null, false, { message: 'Incorrect password' });
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ));

  passport.serializeUser((user, done) => {
    done(null, user._id.toString());
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  const authenticate = (req, res, next) => {
    passport.authenticate('local', { session: true }, (err, user, info) => {
      if (err) { return next(err); }
      if (!user) { return res.redirect('/login'); }
      req.logIn(user, (err) => {
        if (err) { return next(err); }
        return res.redirect('/');
      });
    })(req, res, next);
  };

  const isLoggedIn = (req, res, next) => {
    if (req.user) {
      return next();
    }
    return res.redirect('/login');
  };

  return {
    authenticate,
    isLoggedIn,
  };
})();

module.exports = UserAuth;
