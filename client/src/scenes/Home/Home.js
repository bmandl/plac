import React, { useRef, useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interaction from '@fullcalendar/interaction'

import './Home.scss';

const Home = () => {
    const calendarRef = useRef(null);
    const [selectable, setSelectable] = useState();

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
        calendarRef.current.getApi().addEvent({
            title:prompt("Ime: "),
            start:selectionInfo.start,
            end:selectionInfo.end,
            durationEditable:true,
            startEditable:true,
            editable:true
        })
        let opomba = prompt("Opomba: ");
        console.log(calendarRef.current.getApi().getEvents())
    }

    return (
        <div className="calendar-container">
            <FullCalendar ref={calendarRef} defaultView="dayGridMonth" plugins={[dayGridPlugin, timeGridPlugin, interaction]} height={"parent"} locale="sl" selectable={selectable} eventOverlap={false}
                header={{ left: 'title', center: '', right: 'dayGridMonth today prev,next' }}
                buttonText={{ today: "Danes", month: "Mesec", week: "Teden", day: "Dan", list: "Seznam" }}
                dateClick={handleDayClick}
                datesRender={handleMonthClick}
                select={handleTimeSelect}
            />
        </div>
    )

}

export default Home;