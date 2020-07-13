const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

const UserAuth = (() => {
  passport.use(new LocalStrategy( // definition for local authenticate strategy
    (username, password, done) => User.find(username).then((user) => {
      if (!user) return done(null, false, { message: 'Incorrect username' });
      if (!user.validPassword(password)) return done(null, false, { message: 'Incorrect password' });
      return done(null, user);
    }).catch((err) => done(err))
    ,
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    done(null, User.find(id));
  });

  const authenticate = (req, res, next) => {
    // authenticate user with passport library
    passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/api/events/list', session: true })(req, res, next);
  };

  const isLoggedIn = (req, res, next) => {
    if (req.user) next();
    res.redirect('/login');
    res.end();
  };

  return {
    authenticate,
    isLoggedIn,
  };
})();

module.exports = UserAuth;
