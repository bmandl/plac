/* eslint-disable no-console */
const { google } = require('googleapis');
// eslint-disable-next-line no-unused-vars
// const { calendar } = require('googleapis/build/src/apis/calendar');
// eslint-disable-next-line global-require
const privatekey = `${require('path').resolve(__dirname, '..')}/privatekey.json`;

const googleEvent = (() => {
  // Google Calendar API
  const calendar = google.calendar('v3');
  const auth = new google.auth.GoogleAuth({
    keyFile: privatekey,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  const connect = async () => {
    // configure a JWT auth client
    try {
      const res = await auth.getClient();
      google.options('auth', res);
      return 200;
    } catch (err) {
      console.log(err);
      return 500;
    }
  };

  // Injects a string like "arg=value" into the querystring of a URL
  // TODO: move to a general util file?
  function injectQsComponent(url, component) {
    // inject it after the querystring but before the fragment
    return url.replace(/(\?.*?)?(#|$)/, (whole, qs, hash) => (qs ? `${qs}&` : '?') + component + hash);
  }

  function gcalItemToRawEventDef(item, gcalTimezone) {
    let url = item.htmlLink || null;
    // make the URLs for each event show times in the correct timezone
    if (url && gcalTimezone) {
      url = injectQsComponent(url, `ctz=${gcalTimezone}`);
    }
    return {
      id: item.id,
      title: item.summary,
      start: item.start.dateTime || item.start.date,
      end: item.end.dateTime || item.end.date,
      url,
      location: item.location,
      description: item.description,
    };
  }

  function gcalItemsToRawEventDefs(items, gcalTimezone) {
    return items.map((item) => gcalItemToRawEventDef(item, gcalTimezone));
  }

  const list = () => {
    const items = calendar.events.list({
      auth,
      calendarId: 'placmezica@gmail.com',
    });
    return items.then((obj) => gcalItemsToRawEventDefs(obj.data.items));
  };

  const insert = (event) => calendar.events.insert({
    auth,
    // Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
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

  const deleteEvent = (eventId) => calendar.events.delete({
    auth,
    calendarId: 'placmezica@gmail.com',
    eventId,
  });

  return {
    authClient: () => connect(),
    list,
    insert,
    deleteEvent,
  };
})();

exports.calendar = googleEvent;
