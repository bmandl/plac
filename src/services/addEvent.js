/* eslint-disable no-console */
import eventDuration from '../utils/eventDuration';

const addEvent = async (selected, eventId, formData) => {
  if (!eventId) { // adding new event if no event is selected for editing
    const { start, end } = eventDuration(formData.Datum, formData.Od, formData.Do);
    const event = { ...selected, title: formData.Namen, description: formData.Opombe };
    event.start = start;
    event.end = end;
    try {
      const response = await
      fetch('/api/events/insert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
      const data = await response.json();
      console.log(`Success. Event with id: ${data.id} added.`);
      // showForm(false); // close form
      // setEvents(updateEvents(events, { action: 'ADD', payload: { ...event, id: data.id } }));
      return { action: 'ADD', payload: { ...event, id: data.id } };
    } catch (error) {
      throw new Error(error);
    }
  }
};

export default addEvent;
