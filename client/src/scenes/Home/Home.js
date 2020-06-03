import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interaction from '@fullcalendar/interaction'

import './Home.scss';

const Home = () => {
    const calendarRef = useRef(null);

    const handleDayClick = dateClickInfo => {
        calendarRef.current.getApi()
            .changeView("timeGridDay", dateClickInfo.date)
    }

    return (
        <div className="calendar-container">
            <FullCalendar ref={calendarRef} defaultView="dayGridMonth" plugins={[dayGridPlugin, timeGridPlugin, interaction]} height={"parent"} locale="sl"
            header={{left:'title',center:'',right:'dayGridMonth today prev,next'}} 
            buttonText={{today: "Danes",month:"Mesec",week:"Teden",day:"Dan",list:"Seznam"}}
                dateClick={handleDayClick}
            />
        </div>
    )

}

export default Home;