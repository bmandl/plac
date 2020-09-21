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
    res.json(response);
  } catch (err) {
    res.status(500).send(err);
  }
};
