/* eslint-disable no-console */
import eventDuration from '../utils/eventDuration';
import errorHandler from '../utils/fetchError';

const addEvent = async (selected, formData) => {
  const { start, end } = eventDuration(formData.Datum, formData.Od, formData.Do);
  const event = { ...selected, title: formData.Namen, description: formData.Opombe };
  event.start = start;
  event.end = end;

  try {
    const response = errorHandler(await
    fetch('/api/events/insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }), 'Event was not added to calendar');

    const data = await response.json();
    console.log(`Success. Event with id: ${data.id} added.`);
    return { action: 'ADD', payload: { ...event, id: data.id } }; // data was received from server - add new event to local storage
  } catch (err) {
    console.error(err);
    return { payload: null };
  }
};

export default addEvent;
