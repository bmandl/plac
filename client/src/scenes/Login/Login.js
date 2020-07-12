import React from 'react';

const Login = () => {
    return (
        <form>
            <input type="text" placeholder="username" name="username" />
            <input type="text" placeholder="password" name="password" />
            <input type="submit" value="login" />
        </form>
    )
}

export default Login;