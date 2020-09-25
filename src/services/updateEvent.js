/* eslint-disable no-console */
import eventDuration from '../utils/eventDuration';

const updateEvent = async (editingEvent, formData) => {
  // editing existing clicked event
  const { start, end } = eventDuration(formData.Datum, formData.Od, formData.Do);
  const event = {
    ...editingEvent, start, end, title: formData.Namen,
  };
  const eventId = event.id;
  try {
    await fetch(`/api/events/update/${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editingEvent),
    });
    console.log(`Success. Event with id: ${eventId} updated. `);
    return { action: 'UPDATE', payload: event };
  } catch (err) {
    throw new Error(err);
  }
};

export default updateEvent;
