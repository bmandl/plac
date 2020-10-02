/* eslint-disable no-console */
import errorHandler from '../utils/fetchError';

const deleteEvent = async (editingEvent) => {
  const eventId = editingEvent.id;
  try {
    errorHandler(await fetch(`/api/events/delete/${eventId}`, {
      method: 'DELETE',
    }), 'Event was not deleted from calendar');

    console.log(`Success. Event with id: ${eventId} deleted.`);
    return { action: 'DELETE', payload: editingEvent };
  } catch (err) {
    console.error(err);
    return null;
  }
};

export default deleteEvent;
