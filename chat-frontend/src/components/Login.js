import React, { useState } from 'react';
import { formContainer, formStyle, formInput } from '../styles/styles';

import axios from 'axios';

function Login({ setToken, setShowRegister }) {
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCredentials((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('https://api.cheeseispower.xyz/login', credentials);
            setToken(response.data.token);
        } catch (error) {
            console.error("Login error", error);
        }
    };

    return (
        <div style={formContainer}>
            <form style={formStyle} onSubmit={handleSubmit}>
                <input style={formInput} type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                <input style={formInput} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
