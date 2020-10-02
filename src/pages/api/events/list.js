/* eslint-disable no-console */
import Google from '../../../services/googleApis';

export default async (req, res) => {
  const google = new Google();
  const events = google.calendar.events.list({
    calendarId: 'placmezica@gmail.com',
  });
  try {
    const response = await events;
    if (response.data.items) res.json(Google.gcalItemsToRawEventDefs(response.data.items));
    else throw new Error('Data was not received from google calendar API');
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};
