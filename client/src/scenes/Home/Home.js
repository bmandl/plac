import React, { useRef, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interaction from '@fullcalendar/interaction'
import EventForm from './components/EventForm';

import './Home.scss';

const Home = () => {
    const calendarRef = useRef(null);
    const [selectable, setSelectable] = useState();
    const [formVisible, showForm] = useState();
    const [selected, setSelected] = useState();

    useEffect(() => {
        if (!selectable) calendarRef.current.getApi().updateSize();
    })

    const handleDayClick = dateClickInfo => {
        calendarRef.current.getApi()
            .changeView("timeGridDay", dateClickInfo.date)
        if (!selectable) setSelectable(true);
    }

    const handleMonthClick = (el) => {
        if (el.view.type != "timeGridDay") setSelectable(false);
    }

    const handleTimeSelect = selectionInfo => {
        //odpiranje forme za dodajanje eventa
        setSelected({
            start: selectionInfo.start,
            end: selectionInfo.end,
            durationEditable: true,
            startEditable: true,
            editable: true
        });
        showForm(true); //open form
    }

    const addEvent = (formData) => {
        const ref = calendarRef.current;
        const api = ref.getApi();
        let event = { ...selected, title: formData.Namen }
        let newStart = new Date(selected.start);    //new start from form
        let newEnd = new Date(selected.end);    //new end from form
        newStart.setHours(Math.floor(formData.Od / 60));
        newStart.setMinutes(formData.Od % 60);
        newEnd.setHours(Math.floor(formData.Do / 60));
        newEnd.setMinutes(formData.Do % 60);
        event.start = newStart;
        event.end = newEnd;
        api.addEvent(event);
        showForm(false);    //close form
    }

    return (
        <>
            <div className="calendar-container">
                <FullCalendar ref={calendarRef} defaultView="dayGridMonth" timezone="local" plugins={[dayGridPlugin, timeGridPlugin, interaction]} height={"parent"} locale="sl" selectable={selectable} eventOverlap={false}
                    header={{ left: 'title', center: '', right: 'dayGridMonth today prev,next' }}
                    buttonText={{ today: "Danes", month: "Mesec", week: "Teden", day: "Dan", list: "Seznam" }}
                    dateClick={handleDayClick}
                    datesRender={handleMonthClick}
                    select={handleTimeSelect}
                />
            </div>
            {formVisible &&
                <EventForm date={calendarRef.current.getApi().formatIso(calendarRef.current.getApi().getDate(), { omitTime: true })}
                    start={selected.start.getHours() * 60 + selected.start.getMinutes()}
                    end={selected.end.getHours() * 60 + selected.end.getMinutes()}
                    onClose={() => showForm(false)}
                    onSubmit={addEvent}
                />}
        </>
    )

}

export default Home;