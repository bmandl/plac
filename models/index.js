const mongoose = require('mongoose');

const database = (() => {
  const connect = () => {
    mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
    const { connection } = mongoose;
    return connection;
  };

  return {
    connect,
  };
})();

module.exports = database;
