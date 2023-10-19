// AuthContext.js
import React, { createContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // ...其他state和函数

    const handleLogout = () => {
        fetch('https://api.cheeseispower.xyz/logout', {
            method: 'POST',
            credentials: 'include'
        }).then(() => {
            // ...处理客户端注销逻辑，如重定向到登录页面等
        });
    };

    return (
        <AuthContext.Provider value={{ handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
