var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

let {google} = require('googleapis');
let privatekey = require("./privatekey.json");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// configure a JWT auth client
let jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ['https://www.googleapis.com/auth/calendar']);
//authenticate request
jwtClient.authorize(function (err, tokens) {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log("Successfully connected!");
    }
});

//Google Calendar API
let calendar = google.calendar('v3');
calendar.events.list({
    auth: jwtClient,
    calendarId: 'primary'
}, function (err, response) {
    if (err) {
        console.log('The API returned an error: ' + err);
        return;
    }
    var events = response.data.items;
    if (events.length == 0) {
        console.log('No events found.');
    } else {
        console.log('Event from Google Calendar:');
        for (let event of response.data.items) {
            console.log('Event name: %s, Creator name: %s, Create date: %s', event.summary, event.creator.displayName, event.start.date);
        }
    }
});

module.exports = app;
