const UserAuth = (() => {
  const authenticate = (req,res,next) => {
    // authenticate user with passport library
    next();
  };

  return {
    authenticate,
  };
})();

module.exports = UserAuth;
