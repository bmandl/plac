import React from 'react';
import { useForm } from 'react-hook-form';

const EventForm = () => {
    const { register, handleSubmit, errors } = useForm();
    const onSubmit = data => console.log(data);

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="text" placeholder="Namen" name="Namen" ref={register({ required: true, min: 3 })} />
                <input type="datetime" placeholder="Datum" name="Datum" ref={register({ required: true })} />
                <select name="Od" ref={register({ required: true })}>
                </select>
                <select name="Do" ref={register({ required: true })}>
                </select>
                <select name="Ponovljivost" ref={register}>
                    <option value="Brez">Brez</option>
                    <option value="Dnevno">Dnevno</option>
                    <option value="Tedensko">Tedensko</option>
                    <option value="Mesečno">Mesečno</option>
                </select>
                <input type="text" placeholder="Opombe" name="Opombe" ref={register} />

                <input type="submit" />
            </form>
        </div>
    );
}

export default EventForm;