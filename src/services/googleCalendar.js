const { google } = require('googleapis');

export default class Google {
  constructor() {
    this.auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    this.calendar = google.calendar({
      version: 'v3',
      auth: this.auth,
    });
  }

  static gcalItemToRawEventDef(item, gcalTimezone) {
    const url = item.htmlLink || null;
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

  static gcalItemsToRawEventDefs(items, gcalTimezone) {
    return items.map((item) => this.gcalItemToRawEventDef(item, gcalTimezone));
  }
}
