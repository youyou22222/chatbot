import React, { useState } from 'react';
import { formContainer, formStyle, formInput } from '../styles/styles';

import axios from 'axios';

function Register({ setShowRegister }) {
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
            await axios.post('https://api.cheeseispower.xyz/register', credentials);
            setShowRegister(false);
        } catch (error) {
            console.error("Register error", error);
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

export default Register;
