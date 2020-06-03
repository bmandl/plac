import React, { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interaction from '@fullcalendar/interaction'

import './Home.scss';

const Home = () => {
    const calendarRef = useRef(null);
    const [selectable, setSelectable] = useState();
    const handleDayClick = dateClickInfo => {
        calendarRef.current.getApi()
            .changeView("timeGridDay", dateClickInfo.date)
        if (!selectable) setSelectable(true);
    }

    return (
        <div className="calendar-container">
            <FullCalendar ref={calendarRef} defaultView="dayGridMonth" plugins={[dayGridPlugin, timeGridPlugin, interaction]} height={"parent"} locale="sl" selectable={selectable}
                header={{ left: 'title', center: '', right: 'dayGridMonth today prev,next' }}
                buttonText={{ today: "Danes", month: "Mesec", week: "Teden", day: "Dan", list: "Seznam" }}
                dateClick={handleDayClick}
                datesRender={() => setSelectable(false)}
            />
        </div>
    )

}

export default Home;