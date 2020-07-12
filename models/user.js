const mongoose = require('mongoose');

const User = (() => {
  const find = async (username) => {
    console.log("test");
    return null;
  };

  return {
    find,
  };
})();

module.exports = User;
