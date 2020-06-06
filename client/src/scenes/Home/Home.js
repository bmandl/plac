import React, { useRef, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interaction from '@fullcalendar/interaction'
import EventForm from './components/EventForm';
import v4 from 'uuid/dist/v4';

import './Home.scss';

const Home = () => {
    const calendarRef = useRef(null);
    const [selectable, setSelectable] = useState();
    const [formVisible, showForm] = useState();
    const [selected, setSelected] = useState();
    const [eventId, setEventId] = useState();
    const [events,setEvents] = useState();

    useEffect(() => {
        if (!selectable) calendarRef.current.getApi().updateSize();
    })

    const handleDayClick = dateClickInfo => {
        calendarRef.current.getApi()
            .changeView("timeGridDay", dateClickInfo.date)
        if (!selectable) setSelectable(true);
    }

    const handleMonthClick = el => {
        if (el.view.type != "timeGridDay") setSelectable(false);
    }

    const handleTimeSelect = selectionInfo => {
        //odpiranje forme za dodajanje eventa
        setSelected({
            title: selectionInfo.title,
            start: selectionInfo.start,
            end: selectionInfo.end,
            durationEditable: true,
            startEditable: true,
            editable: true
        });
        setEvents(calendarRef.current.getApi().getEvents());
        showForm(true); //open form
    }

    const addEvent = formData => {
        const id = eventId ? eventId : v4();
        const ref = calendarRef.current;
        const api = ref.getApi();

        let newStart = new Date(formData.Datum);    //new start from form
        let newEnd = new Date(formData.Datum);    //new end from form
        newStart.setHours(Math.floor(formData.Od / 60));
        newStart.setMinutes(formData.Od % 60);
        newEnd.setHours(Math.floor(formData.Do / 60));
        newEnd.setMinutes(formData.Do % 60);

        if (!eventId) { //adding new event if no event is selected for editing
            let event = { ...selected, id, title: formData.Namen }
            event.start = newStart;
            event.end = newEnd;
            api.addEvent(event);
        }

        else {  //editing existing clicked event
            const editingEvent = api.getEventById(id);
            editingEvent.setStart(newStart);
            editingEvent.setEnd(newEnd);
            editingEvent.setProp("title", formData.Namen);
        }
        showForm(false);    //close form
        setEventId(null);   //reset id for event (unselect event)
    }

    const handleEventClick = eventClickInfo => {
        setEventId(eventClickInfo.event.id);
        handleTimeSelect(eventClickInfo.event);
    }

    return (
        <>
            <div className="calendar-container">
                <FullCalendar ref={calendarRef} defaultView="dayGridMonth" timezone="local" plugins={[dayGridPlugin, timeGridPlugin, interaction]} height={"parent"} locale="sl" editable={true} selectable={selectable} eventOverlap={false}
                    header={{ left: 'title', center: '', right: 'dayGridMonth today prev,next' }}
                    buttonText={{ today: "Danes", month: "Mesec", week: "Teden", day: "Dan", list: "Seznam" }}
                    dateClick={handleDayClick}
                    datesRender={handleMonthClick}
                    select={handleTimeSelect}
                    eventClick={handleEventClick}
                />
            </div>
            {formVisible &&
                <EventForm date={calendarRef.current.getApi().formatIso(calendarRef.current.getApi().getDate(), { omitTime: true })}
                    events={events}
                    title={selected.title}
                    start={selected.start.getHours() * 60 + selected.start.getMinutes()}
                    end={selected.end.getHours() * 60 + selected.end.getMinutes()}
                    onClose={() => showForm(false)}
                    onSubmit={addEvent}
                />}
        </>
    )

}

export default Home;