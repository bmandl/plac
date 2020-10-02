/* eslint-disable no-console */
import eventDuration from '../utils/eventDuration';
import errorHandler from '../utils/fetchError';

const updateEvent = async (editingEvent, formData) => {
  // editing existing clicked event
  const { start, end } = eventDuration(formData.Datum, formData.Od, formData.Do);
  const event = {
    ...editingEvent, start, end, title: formData.Namen,
  };
  const eventId = event.id;
  try {
    errorHandler(await fetch(`/api/events/update/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editingEvent),
    }), 'Event was not updated');
    console.log(`Success. Event with id: ${eventId} updated. `);
    return { action: 'UPDATE', payload: event };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default updateEvent;
