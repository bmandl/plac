import React, { useState } from 'react';
import {Redirect} from 'react-router-dom';

const Login = () => {

    const [username,setUsername] = useState();
    const [password,setPassword] = useState();
    const [redirect,setRedirect] = useState();

    const handleUsername = (el) => {
        setUsername(el.target.value);
    }

    const handlePassword = (el) => {
        setPassword(el.target.value);
    }

    const submitLogin = (event) => {
        event.preventDefault();
        fetch('/login',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({username,password})
        }
            ).then(()=>setRedirect(true));
    }

    return (
        <>
        <form onSubmit={submitLogin}>
            <input type="text" placeholder="username" name="username" onChange={handleUsername} />
            <input type="text" placeholder="password" name="password" onChange={handlePassword} />
            <input type="submit" value="login" />
        </form>
        {redirect && <Redirect to='/' />}
        </>
    )
}

export default Login;