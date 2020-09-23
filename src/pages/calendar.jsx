import React, { useRef, useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { signIn, signOut, useSession } from 'next-auth/client';
import useSWR from 'swr';

import EventForm from '../components/EventForm';
import fetcher from '../services/fetchers';
import Loading from '../components/Loading';

const Home = () => {
  const localizer = momentLocalizer(moment);
  const calendarRef = useRef(null);
  const [selectable, setSelectable] = useState();
  const [formVisible, showForm] = useState();
  const [selected, setSelected] = useState();
  const [eventId, setEventId] = useState(null);
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState();
  const [session, loading] = useSession();
  const {
    data, error, isValidating,
  } = useSWR('/api/events/list', fetcher);

  useEffect(() => {
    if (!formVisible && data && !error) {
      // eslint-disable-next-line max-len
      setEvents(data.map((event) => // changing start and end elements of event object to Date objects instead of String - causing issues with differend views.
        // event.start = new Date(event.start);
        // event.end = new Date(event.end);
        ({ ...event, start: new Date(event.start), end: new Date(event.end) })));
    }
  }, [data]);

  useEffect(() => {
    // eslint-disable-next-line max-len
    if (eventId) handleTimeSelect(events.find((event) => event.id === eventId)); // loop over events array to find event with selected id
  }, [eventId]);

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
    showForm(true); // open form
  };

  const updateEvents = ({ action, payload }) => {
    const localEvents = events;
    switch (action) {
      case 'ADD': setEvents([...localEvents, payload]);
        break;
      case 'DELETE': setEvents(localEvents.filter((event) => event.id !== payload.id));
        break;
      case 'UPDATE':
        setEvents(localEvents.map((event) => (event.id === payload.id ? payload : event)));
        break;
      default: break;
    }
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
        .then((data) => {
          console.log(`Success. Event with id: ${data.id} added.`);
          showForm(false); // close form
          updateEvents({ action: 'ADD', payload: { ...event, id: data.id } });
        });
    } else { // editing existing clicked event
      const editingEvent = events.find((event) => event.id === eventId);
      editingEvent.start = newStart;
      editingEvent.end = newEnd;
      editingEvent.title = formData.Namen;
      fetch(`/api/events/update/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingEvent),
      }).then(() => {
        console.log(`Success. Event with id: ${eventId} updated. `);
        showForm(false); // close form
        updateEvents({ action: 'UPDATE', payload: editingEvent });
      }).catch((err) => console.error(err));
      setEventId(null); // reset id for event (unselect event)
    }
  };

  const deleteEvent = () => {
    fetch(`/api/events/delete/${eventId}`, {
      method: 'DELETE',
    }).then(() => {
      console.log(`Success. Event with id: ${eventId} deleted.`);
      showForm(false); // close form
      updateEvents({ action: 'DELETE', payload: events.find((event) => event.id === eventId) });
    }, (err) => console.log(err));
    setEventId(null); // reset id for event (unselect event)
  };

  const handleEventClick = (eventClickInfo) => {
    setEventId(eventClickInfo.id);
  };

  return (
    <>
      {(session || loading)
        ? (
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
            {(loading || isValidating)
              && <Loading />}
          </>
        )
        : (
          <>
            Not signed in
            {' '}
            <br />
            <button onClick={signIn}>Sign in</button>
          </>
        )}
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
