const mongoose = require('mongoose');

const User = (() => {
  const userSchema = new mongoose.Schema({
    username: String,
    password: String,
  });

  const find = async (username) => {
    try {
      const user = await mongoose.model('User', userSchema).findOne({ username }).exec();
      return { ...user.toObject(), validPassword: (password) => user.password === password };
    } catch (error) {
      return error;
    }
  };

  const findById = async (id) => {
    try {
      const user = await mongoose.model('User', userSchema).findById(id).exec();
      return user.toObject();
    } catch (error) {
      return error;
    }
  };

  return {
    find,
    findById,
  };
})();

module.exports = User;
