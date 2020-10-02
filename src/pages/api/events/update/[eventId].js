/* eslint-disable no-console */
import Google from '../../../../services/googleApis';

export default async (req, res) => {
  const google = new Google();
  const { query: { eventId } } = req;
  const event = req.body;
  try {
    const response = await google.calendar.events.update({
      calendarId: 'placmezica@gmail.com',
      eventId,
      requestBody: {
        end: {
          dateTime: event.end,
        },
        start: {
          dateTime: event.start,
        },
        summary: event.title,
        description: event.description,
      },
    });
    if (response) res.json(response);
    else throw new Error('Data was not received from google calendar API');
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};
