import React from 'react';
import { useForm } from 'react-hook-form';
import './EventForm.scss';

const EventForm = (props) => {
    const { register, handleSubmit, errors, watch } = useForm();
    const onSubmit = data => console.log(data);
    console.log(props.date);

    const optionsDuration = (start) => {

        let x = 30; //minutes interval
        let times = []; // time array
        let tt;
        isNaN(start) ? tt = 0 : tt = start + x; // start time
        //loop to increment the time and push results in array
        for (let i = 0; tt < 24 * 60; i++) {            
            let hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
            let mm = (tt % 60); // getting minutes of the hour in 0-55 format
            let value = tt;
            times[i] = <option value={value}>{("0" + hh).slice(-2) + ':' + ("0" + mm).slice(-2)}</option>; // pushing data in array in [00:00 - 12:00 AM/PM format]
            tt = tt + x;
        }

        return times;
    }

    return (
        <div className="form-modal">
            <div className="form-container">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="text" placeholder="Namen" name="Namen" ref={register({ required: true, min: 3 })} />
                    <label htmlFor="Datum">Datum</label>
                    <input type="date" defaultValue={props.date} placeholder="Datum" name="Datum" ref={register({ required: true })} />
                    <label htmlFor="Od">Od</label>
                    <select name="Od" ref={register({ required: true })}>
                        {optionsDuration()}
                    </select>
                    <label htmlFor="Do">Do</label>
                    <select name="Do" ref={register({ required: true })}>
                        {optionsDuration(parseInt(watch("Od")))}
                    </select>
                    <label htmlFor="Ponovljivost">Ponovljivost</label>
                    <select name="Ponovljivost" ref={register}>
                        <option value="Brez">Brez</option>
                        <option value="Dnevno">Dnevno</option>
                        <option value="Tedensko">Tedensko</option>
                        <option value="Mesečno">Mesečno</option>
                    </select>
                    <input type="text" placeholder="Opombe" name="Opombe" ref={register} />

                    <input type="submit" value="Rezerviraj" />
                    <button onClick={props.onClose}>Prekliči</button>
                </form>
            </div>
        </div>
    );
}

export default EventForm;