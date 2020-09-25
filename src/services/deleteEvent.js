/* eslint-disable no-console */

const deleteEvent = async (editingEvent) => {
  const eventId = editingEvent.id;
  try {
    await fetch(`/api/events/delete/${eventId}`, {
      method: 'DELETE',
    });
    console.log(`Success. Event with id: ${eventId} deleted.`);
    return { action: 'DELETE', payload: editingEvent };
  } catch (error) {
    throw new Error(error);
  }
};

export default deleteEvent;
