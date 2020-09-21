import Google from '../../../../services/googleApis';

export default async (req, res) => {
  const google = new Google();
  const { query: { eventId } } = req;
  try {
    const response = await google.calendar.events.delete({
      calendarId: 'placmezica@gmail.com',
      eventId,
    });
    res.json(response);
  } catch (err) {
    res.status(500).send(err);
  }
};
