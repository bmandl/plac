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
    passport.authenticate('local', { session: true }, (err, user, info) => {
      console.log(user);
      if (err) { return next(err); }
      if (!user) { return res.redirect('/login'); }
      req.logIn(user, (err) => {
        if (err) { return next(err); }
        return res.redirect('/api/events/list');
      });
    })(req, res, next);
  };

  const isLoggedIn = (req, res, next) => {
    if (req.user) {
      console.log(req.user);
      return next();
    }
    res.redirect('/login');
  };

  return {
    authenticate,
    isLoggedIn,
  };
})();

module.exports = UserAuth;
