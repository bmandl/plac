const {google} = require('googleapis');

const EventController = (() => {
  const googleCalendar = google.calendar('v3');
 
  // eslint-disable-next-line no-unused-vars
  const gcalItemToRawEventDef = (item, gcalTimezone) => {
    const url = item.htmlLink || null;
    // make the URLs for each event show times in the correct timezone
    /* if (url && gcalTimezone) {
                  url = injectQsComponent(url, 'ctz=' + gcalTimezone);
              } */
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

  const gcalItemsToRawEventDefs = (items, gcalTimezone) => items.map((item) => this.gcalItemToRawEventDef(item, gcalTimezone));

  const list = async (req, res) => {
    const events = googleCalendar.events.list({
      calendarId: 'placmezica@gmail.com',
    });
    try {
      console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);
      const response = await events;
      console.log(response);
      if (response.data.items) res.json(gcalItemsToRawEventDefs(response.data.items));
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  };

  const insert = async (req, res) => {

  };

  const remove = async (req, res) => {


  };

  return {
    list,
    insert,
    remove,
  };
})();

module.exports = EventController;
