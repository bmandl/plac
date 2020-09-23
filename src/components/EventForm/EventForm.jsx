import React from 'react';
import { useForm } from 'react-hook-form';
import styles from './EventForm.module.scss';

const EventForm = (props) => {
  const {
    register, handleSubmit, errors, watch,
  } = useForm({
    defaultValues: {
      Namen: props.title,
      Od: props.start,
      Do: props.end,
      Datum: props.date,
    },
  });

  const optionsDuration = (start) => {
    const x = 30; // minutes interval
    const times = []; // time array
    let tt;
    isNaN(start) ? tt = 0 : tt = start + x; // start time
    // loop to increment the time and push results in array
    for (let i = 0; tt < 24 * 60; i++) {
      const hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
      const mm = (tt % 60); // getting minutes of the hour in 0-55 format
      const value = tt;
      times[i] = <option key={i} value={value}>{`${(`0${hh}`).slice(-2)}:${(`0${mm}`).slice(-2)}`}</option>; // pushing data in array in [00:00 - 24:00 format]
      tt += x;
    }

    return times;
  };

  const validateDuration = () => props.events.length === 0 || props.events.every((event) => {
    const Od = new Date(watch('Datum'));
    const Do = new Date(watch('Datum'));
    Od.setHours(Math.floor(watch('Od') / 60));
    Od.setMinutes(watch('Od') % 60);
    Do.setHours(Math.floor(watch('Do') / 60));
    Do.setMinutes(watch('Do') % 60);
    return (Od < event.start && Do <= event.start) || (Od >= event.end && Do > event.end) || event.id === props.eventId;
  });

  return (
    <div className={styles.modal}>
      <div className={styles.container}>
        <form onSubmit={handleSubmit(props.eventId ? props.onSubmit : props.onAdd)}>
          <input type="text" placeholder="Namen" name="Namen" ref={register({ required: true, min: 3 })} />
          <label htmlFor="Datum">Datum</label>
          <input type="date" placeholder="Datum" name="Datum" ref={register({ required: true })} />
          <label htmlFor="Od">Od</label>
          <select name="Od" ref={register({ required: true, validate: validateDuration })}>
            {optionsDuration()}
          </select>
          <label htmlFor="Do">Do</label>
          <select name="Do" ref={register({ required: true, validate: validateDuration })}>
            {optionsDuration(parseInt(watch('Od')))}
          </select>
          <label htmlFor="Ponovljivost">Ponovljivost</label>
          <select name="Ponovljivost" ref={register}>
            <option value="Brez">Brez</option>
            <option value="Dnevno">Dnevno</option>
            <option value="Tedensko">Tedensko</option>
            <option value="Mesečno">Mesečno</option>
          </select>
          <input type="text" placeholder="Opombe" name="Opombe" ref={register} />

          <input type="submit" value={props.eventId ? 'Uredi' : 'Dodaj'} />
          <button type="button" onClick={props.onClose}>Prekliči</button>
          {props.eventId && <button type="button" onClick={props.onDelete}>Izbriši</button>}
        </form>
      </div>
    </div>
  );
};

export default EventForm;
