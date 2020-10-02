import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { signIn, signOut, useSession } from 'next-auth/client';
import useSWR from 'swr';

// services
import fetcher from '../services/fetchers';
import addEvent from '../services/addEvent';
import updateEvent from '../services/updateEvent';
import deleteEvent from '../services/deleteEvent';

// utils
import updateEvents from '../utils/updateEvents';
import getEditingEvent from '../utils/getEditingEvent';

// components
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
  const [editingEvent, setEditingEvent] = useState();
  const { data, error, isValidating } = useSWR('/api/events/list', fetcher);

  useEffect(() => { // fetching new data on refreshing
    if (!formVisible && data && !error) {
      // eslint-disable-next-line max-len
      // changing start and end elements of event object to Date objects instead of String - causing issues with differend views.
      // eslint-disable-next-line max-len
      setEvents(data.map((event) => ({ ...event, start: new Date(event.start), end: new Date(event.end) })));
    }
  }, [data]);

  useEffect(() => { // seting editing event when clicked on event or form closed
    if (eventId) {
      // eslint-disable-next-line max-len
      handleTimeSelect(events.find((event) => event.id === eventId)); // loop over events array to find event with selected id
      setEditingEvent(getEditingEvent(events, eventId));
    }
    if (!formVisible && !eventId) setEditingEvent(null);
  }, [eventId]);

  const handleTimeSelect = (selectionInfo) => {
    // opening form for event adding
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

  const handleAddEvent = async (formData) => {
    // adding event to google Calendar and refreshing local event data without fetching
    const eventToAdd = await addEvent(selected, formData);
    if (eventToAdd) setEvents(updateEvents(events, eventToAdd));
    showForm(false);
  };

  const handleUpdateEvent = async (formData) => {
    // updating event on google calendar and refreshing local event data without fetching
    const eventToUpdate = await updateEvent(editingEvent, formData);
    if (eventToUpdate) setEvents(updateEvents(events, eventToUpdate));
    setEventId(null); // reset id for event (unselect event)
    showForm(false); // close form
  };

  const handleDeleteEvent = async () => {
    // deleting event on google Calendar and refreshing local event data without fetching
    const eventToDelete = await deleteEvent(editingEvent);
    if (eventToDelete) setEvents(updateEvents(events, eventToDelete));
    setEventId(null); // reset id for event (unselect event)
    showForm(false);
  };

  const handleEventClick = (eventClickInfo) => {
    // setting id for selected event
    setEventId(eventClickInfo.id);
  };

  const handleCloseForm = () => {
    showForm(false);
    setEventId(null);
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
                  onClose={handleCloseForm}
                  onDelete={handleDeleteEvent}
                  onSubmit={handleUpdateEvent}
                  onAdd={handleAddEvent}
                />
                )}
    </>
  );
};

export default Home;
