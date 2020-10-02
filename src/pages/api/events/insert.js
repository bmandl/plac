/* eslint-disable no-console */
import Google from '../../../services/googleApis';

export default async (req, res) => {
  const google = new Google();
  const event = req.body;
  try {
    const response = await google.calendar.events.insert({
      /* Calendar identifier. To retrieve calendar IDs call the calendarList.list method.
              If you want to access the primary calendar of the currently logged in user,
              use the "primary" keyword. */
      calendarId: 'placmezica@gmail.com',
      // Request body metadata
      requestBody:
      // request body parameters
      {
        description: event.description,
        end: {
          // timeZone: "Europe/Belgrade",
          dateTime: event.end,
        },
        start: {
          // timeZone: "Europe/Belgrade",
          dateTime: event.start,
        },
        summary: event.title,
      },
    });
    if (response.data) res.json(response.data); // response with json of added event
    else throw new Error('Data was not received from google calendar API'); // server-side error thrown
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};
