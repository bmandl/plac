import Google from '../../../services/googleCalendar';

export default async (req, res) => {
  const google = new Google();
  const events = google.calendar.events.list({
    calendarId: 'placmezica@gmail.com',
  });
  try {
    const response = await events;
    if (response.data.items) res.json(Google.gcalItemsToRawEventDefs(response.data.items));
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
