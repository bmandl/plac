const updateEvents = (localEvents, { action, payload }) => {
  let events = [];
  switch (action) {
    case 'ADD': events = [...localEvents, payload];
      break;
    case 'DELETE': events = localEvents.filter((event) => event.id !== payload.id);
      break;
    case 'UPDATE':
      events = localEvents.map((event) => (event.id === payload.id ? payload : event));
      break;
    default: break;
  }
  return events;
};

export default updateEvents;
