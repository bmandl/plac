const { google } = require('googleapis');

const EventController = (() => {
  const googleCalendar = google.calendar('v3');
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });
  google.options({ auth });

  // eslint-disable-next-line no-unused-vars
  const gcalItemToRawEventDef = (item, gcalTimezone) => {
    const url = item.htmlLink || null;
    // make the URLs for each event show times in the correct timezone
    /* if (url && gcalTimezone) {
                  url = injectQsComponent(url, 'ctz=' + gcalTimezone);
              } */
    console.log(item);
    return {
      id: item.id,
      title: item.summary,
      start: item.start.dateTime || item.start.date,
      end: item.end.dateTime || item.end.date,
      url,
      location: item.location,
      description: item.description,
    };
  };

  const gcalItemsToRawEventDefs = (items, gcalTimezone) => items.map((item) => gcalItemToRawEventDef(item, gcalTimezone));

  const list = async (req, res) => {
    const events = googleCalendar.events.list({
      calendarId: 'placmezica@gmail.com',
    });
    try {
      const response = await events;
      if (response.data.items) res.json(gcalItemsToRawEventDefs(response.data.items));
    } catch (err) {
      res.status(500).send(err);
    }
  };

  const insert = async (req, res) => {
    const event = req.body;
    try {
      const response = await googleCalendar.events.insert({
        /* Calendar identifier. To retrieve calendar IDs call the calendarList.list method.
                If you want to access the primary calendar of the currently logged in user,
                use the "primary" keyword. */
        calendarId: 'placmezica@gmail.com',
        // Request body metadata
        requestBody:
            // request body parameters
            {
              //   "anyoneCanAddSelf": false,
              //   "attachments": [],
              // "attendees": event.attendees,
              //   "attendeesOmitted": false,
              //   "colorId": "my_colorId",
              //   "conferenceData": {},
              //   "created": "my_created",
              // "creator": event.creator,
              description: event.description,
              end: {
                // timeZone: "Europe/Belgrade",
                dateTime: event.end,
              },
              //   "endTimeUnspecified": false,
              //   "etag": "my_etag",
              // "extendedProperties": event.extendedProperties,
              //   "gadget": {},
              //   "guestsCanInviteOthers": false,
              //   "guestsCanModify": false,
              //   "guestsCanSeeOtherGuests": false,
              //   "hangoutLink": "my_hangoutLink",
              //   "htmlLink": "my_htmlLink",
              //   "iCalUID": "my_iCalUID",
              // "id": event.id,
              //   "kind": "my_kind",
              //   "location": "my_location",
              //   "locked": false,
              // "organizer": event.organizer,
              //   "originalStartTime": {},
              //   "privateCopy": false,
              //   "recurrence": [],
              //   "recurringEventId": "my_recurringEventId",
              //   "reminders": {},
              //   "sequence": 0,
              //   "source": {},
              start: {
                // timeZone: "Europe/Belgrade",
                dateTime: event.start,
              },
              // "status": event.status,
              summary: event.title,
              //   "transparency": "my_transparency",
              //   "updated": "my_updated",
              //   "visibility": "my_visibility"
            },
      });
      if (response.data) res.json(response.data);
    } catch (err) {
      res.status(500).send(err);
    }
  };

  const remove = async (req, res) => {
    const { eventId } = req.params;
    try {
      const response = await googleCalendar.events.delete({
        calendarId: 'placmezica@gmail.com',
        eventId,
      });
      res.json(response);
    } catch (err) {
      res.status(500).send(err);
    }
  };

  return {
    list,
    insert,
    remove,
  };
})();

module.exports = EventController;
