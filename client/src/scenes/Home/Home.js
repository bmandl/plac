import React from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

import './Home.scss';

const Home = () => {
    return (
        <FullCalendar defaultView="dayGridMonth" plugins={[ dayGridPlugin ]} />
    )
}

export default Home;