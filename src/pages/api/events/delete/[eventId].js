/* eslint-disable no-console */
import Google from '../../../../services/googleApis';

export default async (req, res) => {
  const google = new Google();
  const { query: { eventId } } = req;
  try {
    const response = await google.calendar.events.delete({
      calendarId: 'placmezica@gmail.com',
      eventId,
    });
    if (response) res.json(response);
    else throw new Error('Data was not received from google calendar API');
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};
