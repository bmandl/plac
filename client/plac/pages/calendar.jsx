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
  const [eventId, setEventId] = useState(null);
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState();

  useEffect(() => {
    fetch('/api/events/list').then((response) => response.json()).then((data) => {
      setEvents(data.map((event) => { // changing start and end elements of event object to Date objects instead of String - causing issues with differend views.
        event.start = new Date(event.start);
        event.end = new Date(event.end);
        return event;
      }));
    }).catch((err) => console.log(err));

    if (eventId) handleTimeSelect(events.find((event) => event.id === eventId)); // loop over events array to find event with selected id
  }, [eventId, formVisible]);

  const handleTimeSelect = (selectionInfo) => {
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
    setDate(moment(selectionInfo.start).toISOString(true).split('T', 1)[0]); // get current date from selected event and ommit time
    // api.refetchEvents();
    // setEvents(api.getEvents());
    showForm(true); // open form
  };

  const addEvent = (formData) => {
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
          console.log(`Success. Event with id: ${event.id} added.`);
          showForm(false); // close form
        });
    } else { // editing existing clicked event
      /* const editingEvent = events.find((event) => event.id === eventId);
      editingEvent.setStart(newStart);
      editingEvent.setEnd(newEnd);
      editingEvent.setProp('title', formData.Namen); */
      showForm(false); // close form
    }
    setEventId(null); // reset id for event (unselect event)
  };

  const deleteEvent = () => {
    fetch(`/api/events/delete/${eventId}`, {
      method: 'DELETE',
    }).then(() => {
      console.log(`Success. Event with id: ${eventId} deleted.`);
      showForm(false); // close form
    }, (err) => console.log(err));
    setEventId(null); // reset id for event (unselect event)
  };

  const handleEventClick = (eventClickInfo) => {
    setEventId(eventClickInfo.id);
  };

  return (
    <>
      <div className="calendar-container">
        <Calendar
          selectable
          localizer={localizer}
          events={events}
          onSelectSlot={handleTimeSelect}
          onSelectEvent={handleEventClick}
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
                  onClose={() => { showForm(false); setEventId(null); }}
                  onDelete={deleteEvent}
                  onSubmit={addEvent}
                />
                )}
    </>
  );
};

export default Home;
