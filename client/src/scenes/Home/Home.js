import React, { useRef, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interaction from '@fullcalendar/interaction'
import EventForm from './components/EventForm';
import googleCalendarPlugin from '@fullcalendar/google-calendar';

import './Home.scss';

const Home = () => {
    const calendarRef = useRef(null);
    const [selectable, setSelectable] = useState();
    const [formVisible, showForm] = useState();
    const [selected, setSelected] = useState();
    const [eventId, setEventId] = useState();
    const [events, setEvents] = useState();
    const [date, setDate] = useState();

    useEffect(() => {
        if (!selectable) calendarRef.current.getApi().updateSize();
    })

    useEffect(() => {
        const api = calendarRef.current.getApi();
        api.refetchEvents();
        if (eventId)
            handleTimeSelect(api.getEventById(eventId));            
    }, [eventId])

    const handleDayClick = dateClickInfo => {
        const api = calendarRef.current.getApi();
        api.changeView("timeGridDay", dateClickInfo.date)
        if (!selectable) setSelectable(true);
        setDate(api.formatIso(api.getDate(), { omitTime: true }));
    }

    const handleMonthClick = el => {
        if (el.view.type != "timeGridDay") setSelectable(false);
    }

    const handleTimeSelect = selectionInfo => {
        //odpiranje forme za dodajanje eventa
        const api = calendarRef.current.getApi();
        setSelected({
            id: eventId,
            title: selectionInfo.title,
            start: selectionInfo.start,
            end: selectionInfo.end,
            durationEditable: true,
            startEditable: true,
            editable: true
        });
        setDate(selectionInfo.start.toISOString().split('T', 1)[0]); //get current date from selected event and ommit time
        api.refetchEvents();
        setEvents(api.getEvents()); 
        showForm(true); //open form
    }

    const addEvent = formData => {
        const ref = calendarRef.current;
        const api = ref.getApi();

        let newStart = new Date(formData.Datum);    //new start from form
        let newEnd = new Date(formData.Datum);    //new end from form
        newStart.setHours(Math.floor(formData.Od / 60));
        newStart.setMinutes(formData.Od % 60);
        newEnd.setHours(Math.floor(formData.Do / 60));
        newEnd.setMinutes(formData.Do % 60);
        if (!eventId) { //adding new event if no event is selected for editing
            let event = { ...selected, title: formData.Namen, description: formData.Opombe }
            event.start = newStart;
            event.end = newEnd;
            fetch('/api/calendar/insert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(event)
            }).then(response => response.json(), err => console.log(err))
                .then(event => {
                    api.addEvent(event);
                    api.refetchEvents();
                    console.log("Success. Event with id: " + event.id + " added.")
                    showForm(false);    //close form
                });
        }

        else {  //editing existing clicked event
            const editingEvent = api.getEventById(eventId);
            editingEvent.setStart(newStart);
            editingEvent.setEnd(newEnd);
            editingEvent.setProp("title", formData.Namen);
            showForm(false);    //close form
        }
        setEventId(null);   //reset id for event (unselect event)
    }

    const deleteEvent = () => {
        const ref = calendarRef.current;
        const api = ref.getApi();

        fetch('/api/calendar/delete/' + eventId, {
            method: 'DELETE',
        }).then(() => {
            api.getEventById(eventId).remove();
            api.refetchEvents();
            console.log("Success. Event with id: " + eventId + " deleted.");
            showForm(false);    //close form            
        }, err => console.log(err))
        setEventId(null);   //reset id for event (unselect event)
    }

    const handleEventClick = eventClickInfo => {
        eventClickInfo.jsEvent.preventDefault();    // don't let the browser navigate
        setEventId(eventClickInfo.event.id);
    }

    return (
        <>
            <div className="calendar-container">
                <FullCalendar ref={calendarRef} defaultView="dayGridMonth" /*timeZone="Europe/Belgrade"*/ plugins={[dayGridPlugin, timeGridPlugin, interaction, googleCalendarPlugin]} height={"parent"} locale="sl" editable={true} selectable={selectable} eventOverlap={false}
                    googleCalendarApiKey={'AIzaSyALhZsxEXSniZvvpy4IpysyHZ47d4_m3JY'}
                    events={'/api/calendar/list'/*{ googleCalendarId: 'placmezica@gmail.com' }*/}
                    header={{ left: 'title', center: '', right: 'dayGridMonth today prev,next' }}
                    buttonText={{ today: "Danes", month: "Mesec", week: "Teden", day: "Dan", list: "Seznam" }}
                    dateClick={handleDayClick}
                    datesRender={handleMonthClick}
                    select={handleTimeSelect}
                    eventClick={handleEventClick}
                />
            </div>
            {formVisible &&
                <EventForm date={date}
                    events={events}
                    eventId={selected.id}
                    title={selected.title}
                    start={selected.start.getHours() * 60 + selected.start.getMinutes()}
                    end={selected.end.getHours() * 60 + selected.end.getMinutes()}
                    onClose={() => showForm(false)}
                    onDelete={deleteEvent}
                    onSubmit={addEvent}
                />}
        </>
    )

}

export default Home;