const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const routes = require('./routes');
const database = require('./models');

const app = express();
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const connection = database.connect();
connection.on('error', (err) => { throw new Error(err); });
connection.once('open', () => {
  console.log('Database connection successfull');
  app.emit('ready');
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

module.exports = app;
