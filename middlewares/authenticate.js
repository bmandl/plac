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

  const authenticate = (req, res, next) => {
    // authenticate user with passport library
    passport.authenticate('local', { failureRedirect: '/login', session: false })(req, res, next);
  };

  return {
    authenticate,
  };
})();

module.exports = UserAuth;
