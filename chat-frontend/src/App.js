import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Chat from './components/Chat';
import SocketProvider from './context/SocketProvider';

function App() {
  const [isLoading, setIsLoading] = useState(true);  // 添加这一行来表示加载状态
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('https://api.cheeseispower.xyz/status', {
          credentials: 'include'
        });
        const data = await response.json(); // 解析JSON响应
        setIsLoggedIn(data.isLoggedIn); // 更新状态
      } catch (error) {
        console.error("Error checking login status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch('https://api.cheeseispower.xyz/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });
      if (response.status === 200) {

        setIsLoggedIn(true);
      } else {
        alert("Login failed!");
      }
    } catch (error) {
      console.error("There was an error during the login process:", error);
      alert("An error occurred. Please try again.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;  // 如果正在加载，显示加载信息
  }

  return (
      <div className="App">
        {!isLoggedIn ? (
            <div className="login">
              <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Username"
              />
              <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
              />
              <button onClick={handleLogin}>Login</button>
            </div>
        ) : (
            <SocketProvider>
              <Chat />
            </SocketProvider>
        )}
      </div>
  );
}

export default App;
