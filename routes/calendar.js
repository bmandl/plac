let express = require('express');
let router = express.Router();
let { google } = require('googleapis');
let privatekey = require('path').resolve(__dirname, '..') + "\\privatekey.json";

let googleCalendar = (() => {

    //Google Calendar API
    let _calendar = google.calendar('v3');
    const _auth = new google.auth.GoogleAuth({
        keyFile: privatekey,
        scopes: ['https://www.googleapis.com/auth/calendar']
    });

    async function _connect() {
        // configure a JWT auth client        
        try {
            const res = await _auth.getClient();
            google.options('auth', res);
            console.log(res);
            return 200;
        }
        catch (err) {
            console.log(err);
            return 500;
        }
    }


    let list = async () => {
        try {
            let response = await _calendar.events.list({
                auth: _auth,
                calendarId: 'placmezica@gmail.com'
            });

            let events = response.data.items;

            if (events.length == 0) {
                console.log('No events found.');
                return null;
            }

            console.log('Event from Google Calendar:');
            for (let event of events) {
                console.log('Event name: %s, Creator name: %s, Create date: %s', event.summary, event.creator.displayName, event.start.date);
            }
            return events;
        }

        catch (err) {
            return err;
        }
    }

    let insert = async (event) => {
        try {
            const res = await _calendar.events.insert({
                auth:_auth,
                // Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
                calendarId: 'placmezica@gmail.com',
                // Request body metadata
                requestBody: {
                    // request body parameters
                    // {
                    //   "anyoneCanAddSelf": false,
                    //   "attachments": [],
                    //   "attendees": [],
                    //   "attendeesOmitted": false,
                    //   "colorId": "my_colorId",
                    //   "conferenceData": {},
                    //   "created": "my_created",
                    //   "creator": {},
                    //   "description": "my_description",
                    "end": {
                        "date" : "2020-06-10"
                    },
                    //   "endTimeUnspecified": false,
                    //   "etag": "my_etag",
                    //   "extendedProperties": {},
                    //   "gadget": {},
                    //   "guestsCanInviteOthers": false,
                    //   "guestsCanModify": false,
                    //   "guestsCanSeeOtherGuests": false,
                    //   "hangoutLink": "my_hangoutLink",
                    //   "htmlLink": "my_htmlLink",
                    //   "iCalUID": "my_iCalUID",
                    //   "id": "my_id",
                    //   "kind": "my_kind",
                    //   "location": "my_location",
                    //   "locked": false,
                    //   "organizer": {},
                    //   "originalStartTime": {},
                    //   "privateCopy": false,
                    //   "recurrence": [],
                    //   "recurringEventId": "my_recurringEventId",
                    //   "reminders": {},
                    //   "sequence": 0,
                    //   "source": {},
                    "start": {
                        "date" : "2020-06-09"
                    },
                    //   "status": "my_status",
                    //   "summary": "my_summary",
                    //   "transparency": "my_transparency",
                    //   "updated": "my_updated",
                    //   "visibility": "my_visibility"
                    // }
                }
            })

            console.log(res.data);
        }
        catch (err) {
            console.log(err);
        }
    }

    return {
        authClient: () => _connect(),
        list,
        insert
    }

})();

router.use((req, res, next) => {
    googleCalendar.authClient();
    next();
})

router.get('/list', async function (req, res, next) {
    res.send(await googleCalendar.list());
});

router.get('/insert', (req, res, next) => {
    googleCalendar.insert({});
})

module.exports = router;