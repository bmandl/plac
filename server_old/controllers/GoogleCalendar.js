/* eslint-disable linebreak-style */
/* eslint-disable no-console */
import { google } from 'googleapis';
// eslint-disable-next-line no-unused-vars
import { calendar } from 'googleapis/build/src/apis/calendar';

// eslint-disable-next-line global-require
const privatekey = `${require('path').resolve(
  __dirname,
  '../..',
)}/privatekey.json`;

export default class GoogleCalendar {
  // Google Calendar API
  constructor() {
    this.calendar = google.calendar('v3');
    this.auth = new google.auth.GoogleAuth({
      keyFile: privatekey,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
  }

  async connect() {
    // configure a JWT auth client
    try {
      const res = await this.auth.getClient();
      google.options('auth', res);
      return 200;
    } catch (err) {
      console.log(err);
      return 500;
    }
  }

  

  async list() {
    const items = this.calendar.events.list({
      auth: this.auth,
      calendarId: 'placmezica@gmail.com',
    });
    const obj = await items;
    return this.gcalItemsToRawEventDefs(obj.data.items);
  }

  insert(event) {
    this.calendar.events.insert({
      auth: this.auth,
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
  }

  deleteEvent(eventId) {
    this.calendar.events.delete({
      auth: this.auth,
      calendarId: 'placmezica@gmail.com',
      eventId,
    });
  }

  /* return {
            authClient: () => _connect(),
            list,
            insert,
            deleteEvent,
          }; */
}
