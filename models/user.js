const mongoose = require('mongoose');

const User = (() => {
  const find = (username) => new Promise((resolve, reject) => {
    resolve({
      validPassword: () => true,
      username: 'test',
      password: 'test',
      id: 1,
    });
  });

  return {
    find,
  };
})();

module.exports = User;
