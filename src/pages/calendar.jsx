import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { signIn, signOut, useSession } from 'next-auth/client';
import useSWR from 'swr';

import fetcher from '../services/fetchers';
import updateEvents from '../utils/updateEvents';
import EventForm from '../components/EventForm';
import Loading from '../components/Loading';

const Home = () => {
  const localizer = momentLocalizer(moment);
  const [formVisible, showForm] = useState();
  const [selected, setSelected] = useState();
  const [eventId, setEventId] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedDate, setDate] = useState();
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

  // get new date, start time, end time from form
  const eventDuration = (date, from, to) => {
    const start = new Date(date); // new start from form
    const end = new Date(date); // new end from form
    start.setHours(Math.floor(from / 60));
    start.setMinutes(from % 60);
    end.setHours(Math.floor(to / 60));
    end.setMinutes(to % 60);

    return { start, end };
  };

  const addEvent = (formData) => {
    if (!eventId) { // adding new event if no event is selected for editing
      const { start, end } = eventDuration(formData.Datum, formData.Od, formData.Do);
      const event = { ...selected, title: formData.Namen, description: formData.Opombe };
      event.start = start;
      event.end = end;
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
          setEvents(updateEvents(events, { action: 'ADD', payload: { ...event, id: data.id } }));
        });
    }
  };

  const updateEvent = (formData) => {
    // editing existing clicked event
    const { start, end } = eventDuration(formData.Datum, formData.Od, formData.Do);
    const editingEvent = events.find((event) => event.id === eventId);
    editingEvent.start = start;
    editingEvent.end = end;
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
      setEvents(updateEvents(events, { action: 'UPDATE', payload: editingEvent }));
    }).catch((err) => console.error(err));
    setEventId(null); // reset id for event (unselect event)
  };

  const deleteEvent = () => {
    fetch(`/api/events/delete/${eventId}`, {
      method: 'DELETE',
    }).then(() => {
      console.log(`Success. Event with id: ${eventId} deleted.`);
      showForm(false); // close form
      setEvents(updateEvents(events, { action: 'DELETE', payload: events.find((event) => event.id === eventId) }));
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
                  date={selectedDate}
                  events={events}
                  eventId={selected.id}
                  title={selected.title}
                  start={selected.start.getHours() * 60 + selected.start.getMinutes()}
                  end={selected.end.getHours() * 60 + selected.end.getMinutes()}
                  onClose={() => { showForm(false); setEventId(null); }}
                  onDelete={deleteEvent}
                  onSubmit={updateEvent}
                  onAdd={addEvent}
                />
                )}
    </>
  );
};

export default Home;
