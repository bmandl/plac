let express = require('express');
let router = express.Router();
let { google } = require('googleapis');
const { calendar } = require('googleapis/build/src/apis/calendar');
let privatekey = require('path').resolve(__dirname, '..') + "/privatekey.json";

let googleCalendar = (() => {

    //Google Calendar API
    const _calendar = google.calendar('v3');
    const _auth = new google.auth.GoogleAuth({
        keyFile: privatekey,
        scopes: ['https://www.googleapis.com/auth/calendar']
    });

    const _connect = async () => {
        // configure a JWT auth client        
        try {
            const res = await _auth.getClient();
            google.options('auth', res);
            return 200;
        }
        catch (err) {
            console.log(err);
            return 500;
        }
    }


    const list = () => {
        let items =  _calendar.events.list({
            auth: _auth,
            calendarId: 'placmezica@gmail.com'
        });
        return items.then(obj => gcalItemsToRawEventDefs(obj.data.items));
    }

    const insert = event => {

        return _calendar.events.insert({
            auth: _auth,
            // Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
            calendarId: 'placmezica@gmail.com',
            // Request body metadata
            requestBody:
            // request body parameters
            {
                //   "anyoneCanAddSelf": false,
                //   "attachments": [],
                //"attendees": event.attendees,
                //   "attendeesOmitted": false,
                //   "colorId": "my_colorId",
                //   "conferenceData": {},
                //   "created": "my_created",
                //"creator": event.creator,
                "description": event.description,
                "end": {
                    //timeZone: "Europe/Belgrade",
                    dateTime: event.end
                },
                //   "endTimeUnspecified": false,
                //   "etag": "my_etag",
                //"extendedProperties": event.extendedProperties,
                //   "gadget": {},
                //   "guestsCanInviteOthers": false,
                //   "guestsCanModify": false,
                //   "guestsCanSeeOtherGuests": false,
                //   "hangoutLink": "my_hangoutLink",
                //   "htmlLink": "my_htmlLink",
                //   "iCalUID": "my_iCalUID",
                //"id": event.id,
                //   "kind": "my_kind",
                //   "location": "my_location",
                //   "locked": false,
                //"organizer": event.organizer,
                //   "originalStartTime": {},
                //   "privateCopy": false,
                //   "recurrence": [],
                //   "recurringEventId": "my_recurringEventId",
                //   "reminders": {},
                //   "sequence": 0,
                //   "source": {},
                "start": {
                    //timeZone: "Europe/Belgrade",
                    dateTime: event.start
                },
                //"status": event.status,
                "summary": event.title,
                //   "transparency": "my_transparency",
                //   "updated": "my_updated",
                //   "visibility": "my_visibility"
            }

        })
    }

    const deleteEvent = eventId => {
        return _calendar.events.delete({
            auth: _auth,
            calendarId: 'placmezica@gmail.com',
            eventId
        });
    }

    function gcalItemsToRawEventDefs(items, gcalTimezone) {
        return items.map(function (item) {
            return gcalItemToRawEventDef(item, gcalTimezone);
        });
    }
    function gcalItemToRawEventDef(item, gcalTimezone) {
        var url = item.htmlLink || null;
        // make the URLs for each event show times in the correct timezone
        /*if (url && gcalTimezone) {
            url = injectQsComponent(url, 'ctz=' + gcalTimezone);
        }*/
        return {
            id: item.id,
            title: item.summary,
            start: item.start.dateTime || item.start.date,
            end: item.end.dateTime || item.end.date,
            url: url,
            location: item.location,
            description: item.description
        };
    }

    return {
        authClient: () => _connect(),
        list,
        insert,
        deleteEvent
    }

})();

router.use((req, res, next) => {
    googleCalendar.authClient();
    next();
})

router.get('/list', (req, res, next) => {
    /*googleCalendar.list().then(
        obj => {
            const events = obj.data.items;
            if (events.length == 0) {
                res.status(200).send('No events found.');
            }
            let text = 'Event from Google Calendar:\n';
            for (let event of events) {
                text += ('Event name: %s, Creator name: %s, Create date: %s\n', event.summary, event.creator.displayName, event.start.date);
            }
            console.log(events);
            res.status(200).json(events);//send(text);
        },
        err => res.status(500).send(err)
    );*/
    googleCalendar.list().then(data=>res.json(data));
});

router.post('/insert', (req, res, next) => {
    console.log(req.body.start);
    googleCalendar.insert(req.body).then(
        obj => {
            //console.log(obj.data);
            console.log(obj.data.id);
            res.status(200).json(obj.data);
        },
        err => {
            //console.log(err);
            res.status(500).send(err);
        });
});

router.delete('/delete/:eventId', (req, res, next) => {
    googleCalendar.deleteEvent(req.params.eventId).then(
        obj => {
            res.status(200).json(obj);
        },
        err => {
            //console.log(err);
            res.status(500).send(err);
        });
})

module.exports = router;