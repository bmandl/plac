import React, { useRef, useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import EventForm from '../components/EventForm';

const Home = () => {
  const localizer = momentLocalizer(moment);

  const calendarRef = useRef(null);
  const [selectable, setSelectable] = useState();
  const [formVisible, showForm] = useState();
  const [selected, setSelected] = useState();
  const [eventId, setEventId] = useState();
  const [events, setEvents] = useState();
  const [date, setDate] = useState();

  useEffect(() => {
    // const api = calendarRef.current.getApi();
    // api.refetchEvents();
    if (eventId) handleTimeSelect(api.getEventById(eventId));
  }, [eventId]);

  const handleDayClick = (dateClickInfo) => {
    const api = calendarRef.current.getApi();
    api.changeView('timeGridDay', dateClickInfo.date);
    if (!selectable) setSelectable(true);
    setDate(api.formatIso(api.getDate(), { omitTime: true }));
  };

  const handleMonthClick = (el) => {
    if (el.view.type != 'timeGridDay') setSelectable(false);
  };

  const handleTimeSelect = (selectionInfo) => {
    console.log(selectionInfo);
    // odpiranje forme za dodajanje eventa
    // const api = calendarRef.current.getApi();
    setSelected({
      id: eventId,
      title: selectionInfo.title,
      start: selectionInfo.start,
      end: selectionInfo.end,
      durationEditable: true,
      startEditable: true,
      editable: true,
    });
    setDate(new Date(selectionInfo.start).toISOString().split('T', 1)[0]); // get current date from selected event and ommit time
    // api.refetchEvents();
    // setEvents(api.getEvents());
    showForm(true); // open form
  };

  const addEvent = (formData) => {
    const ref = calendarRef.current;
    const api = ref.getApi();

    const newStart = new Date(formData.Datum); // new start from form
    const newEnd = new Date(formData.Datum); // new end from form
    newStart.setHours(Math.floor(formData.Od / 60));
    newStart.setMinutes(formData.Od % 60);
    newEnd.setHours(Math.floor(formData.Do / 60));
    newEnd.setMinutes(formData.Do % 60);
    if (!eventId) { // adding new event if no event is selected for editing
      const event = { ...selected, title: formData.Namen, description: formData.Opombe };
      event.start = newStart;
      event.end = newEnd;
      fetch('/api/events/insert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }).then((response) => response.json(), (err) => console.log(err))
        .then((event) => {
          api.addEvent(event);
          api.refetchEvents();
          console.log(`Success. Event with id: ${event.id} added.`);
          showForm(false); // close form
        });
    } else { // editing existing clicked event
      const editingEvent = api.getEventById(eventId);
      editingEvent.setStart(newStart);
      editingEvent.setEnd(newEnd);
      editingEvent.setProp('title', formData.Namen);
      showForm(false); // close form
    }
    setEventId(null); // reset id for event (unselect event)
  };

  const deleteEvent = () => {
    const ref = calendarRef.current;
    const api = ref.getApi();

    fetch(`/api/events/delete/${eventId}`, {
      method: 'DELETE',
    }).then(() => {
      api.getEventById(eventId).remove();
      api.refetchEvents();
      console.log(`Success. Event with id: ${eventId} deleted.`);
      showForm(false); // close form
    }, (err) => console.log(err));
    setEventId(null); // reset id for event (unselect event)
  };

  const handleEventClick = (eventClickInfo) => {
    eventClickInfo.jsEvent.preventDefault(); // don't let the browser navigate
    setEventId(eventClickInfo.event.id);
  };

  return (
    <>
      <div className="calendar-container">
        <Calendar
          selectable
          localizer={localizer}
          events={[]}
          onSelectSlot={handleTimeSelect}
        />
      </div>
      {formVisible
                && (
                <EventForm
                  date={date}
                  events={events}
                  eventId={selected.id}
                  title={selected.title}
                  start={selected.start.getHours() * 60 + selected.start.getMinutes()}
                  end={selected.end.getHours() * 60 + selected.end.getMinutes()}
                  onClose={() => showForm(false)}
                  onDelete={deleteEvent}
                  onSubmit={addEvent}
                />
                )}
    </>
  );
};

export default Home;
