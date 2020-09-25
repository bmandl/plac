const eventDuration = (date, from, to) => {
  const start = new Date(date); // new start from form
  const end = new Date(date); // new end from form
  start.setHours(Math.floor(from / 60));
  start.setMinutes(from % 60);
  end.setHours(Math.floor(to / 60));
  end.setMinutes(to % 60);

  return { start, end };
};

export default eventDuration;
