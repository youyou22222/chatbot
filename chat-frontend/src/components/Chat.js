    import React, { useState, useContext, useEffect, useCallback } from 'react';
    import SocketContext from '../context/SocketContext';
    import SessionList from './SessionList';
    import MessageList from './MessageList';
    import { API_BASE_URL } from '../constants/constants';
    import '../styles/Chat.css'
    function Chat() {
        const socket = useContext(SocketContext);
        const [sessions, setSessions] = useState([]);
        const [activeSessionId, setActiveSessionId] = useState(null);


        useEffect(() => {
            if (activeSessionId) {
                localStorage.setItem('activeSessionId', activeSessionId);
            }
        }, [activeSessionId]);
        

        const fetchAPI = async (endpoint, options = {}) => {
            try {
                const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
                return res.json();
            } catch (error) {
                console.error(`Failed to fetch ${endpoint}:`, error);
                // TODO: Handle error for the user
                return null;
            }
        };

        const createNewSession = useCallback(async () => {
            try {
                const response = await fetchAPI(`/create-session`, {
                    method: 'POST',
                    credentials: 'include',  // 这确保跨站请求时会发送 cookies
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = response;
                const newSession = data?.sessionId || null;

                if (newSession) {
                    // Update the sessions state with the new session
                    addNewSession(newSession);
                }

                return newSession;
            } catch (error) {
                console.error('Failed to create new session:', error);
                return null;
            }
        }, []);  // 注意这里的空依赖数组，因为这个函数本身不依赖组件的其他props或state

        const handleNewSession = async () => {
            const newSessionId = await createNewSession();
            if (newSessionId) {
                setActiveSessionId(newSessionId);
                //setMessages([]); // 清空当前消息
            }
        };


        const addNewSession = (newSession) => {
            setSessions(prevSessions => [
                { id: newSession, name: 'New Chat' }, // 新会话添加到数组的开头
                ...prevSessions
            ]);
            setActiveSessionId(newSession); // 可选: 如果你希望新会话立即成为活动会话
        };
        

        const fetchSessions = useCallback(async () => {
            const data = await fetchAPI('/sessions', { credentials: 'include' });
            if (data) {
                const reversedSessions = data.slice().reverse();

                setSessions(reversedSessions);
                if (data.length === 0) {
                    const newSessionId = await createNewSession();
                    setActiveSessionId(newSessionId);
                }
            }
        }, [createNewSession]);

        useEffect(() => {
            const savedSessionId = localStorage.getItem('activeSessionId');
            if (savedSessionId) {
                setActiveSessionId(savedSessionId);
                // 此处可能还需要其他逻辑，例如从后端检索会话数据
            } 
                // 如果没有保存的会话ID，可能想要创建一个新的会话或设置一个默认会话
            fetchSessions();
        }, [fetchSessions]);
        


        const onEditSession = async (sessionId, newName) => {
            if (newName.trim() === "") {
                console.error("Session name cannot be empty.");
                // Here you could set some state to show an error message to the user
                return;
            }

            try {
                const response = await fetchAPI(`/sessions/${sessionId}`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: newName }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                // Assuming server responds with updated session
                const updatedSession = response.session;

                // Update session in local state
                setSessions(sessions.map(session =>
                    session.id === sessionId ? updatedSession : session
                ));
            } catch (error) {
                console.error('Failed to update session:', error);
                // Here you could set some state to show an error message to the user
            }
        };

        const onDeleteSession = async (sessionId) => {
            const confirmDelete = window.confirm("Are you sure you want to delete this session?");
            if (confirmDelete) {
                try {
                    const response = await fetchAPI(`/sessions/${sessionId}`, {
                        method: 'DELETE',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });


                    if (!response.success) {
                        throw new Error('Network response was not ok');
                    }
                    if (sessionId === activeSessionId) {
                        setActiveSessionId(null); // 或设置为另一个会话ID
                       

                    }
                    // Update local state to remove the deleted session
                    setSessions(sessions.filter(session => session.id !== sessionId));

                } catch (error) {
                    console.error('Failed to delete session:', error);
                    // Here you could set some state to show an error message to the user
                }
            }
        };

        return (
        <div className="container-fluid chat-container">
            <div className="row">
                {/* SessionList 占据某部分宽度，这里假设是 4/12 */}
                <div className="col-md-3 section-left">
                    <SessionList
                        sessions={sessions}
                        onSessionClick={setActiveSessionId}
                        onNewSession={handleNewSession}
                        activeSessionId={activeSessionId}
                        onEditSession={onEditSession}
                        onDeleteSession={onDeleteSession}
                    />
                </div>

                {/* MessageList 占据剩下的宽度，这里是 8/12 */}
                <div className="col-md-9 section-right">
                    <MessageList activeSessionId={activeSessionId}
                                setActiveSessionId={setActiveSessionId} 
                                createNewSession={createNewSession}
                                addNewSession={addNewSession} 
                                socket={socket} 
                    />
                </div>
            </div>
        </div>
    );


    }

    export default Chat;
