import React, { useState, useEffect } from 'react';
import { ReactComponent as EditIcon } from '../assets/edit-icon.svg';
import { ReactComponent as DeleteIcon } from '../assets/delete-icon.svg';
import '../styles/SessionList.css'; // Assume you have corresponding CSS file for styles

function SessionList({ sessions, onSessionClick, onNewSession, activeSessionId, onEditSession, onDeleteSession }) {
    // State to track which session is being edited
    const [editingSessionId, setEditingSessionId] = useState(null);
    const [sessionName, setSessionName] = useState('');

        // 在SessionList组件中
    useEffect(() => {
        console.log(sessions); // 在此处打印sessions，查看它们何时更新
    }, [sessions]);

    const handleEditClick = (sessionId, name) => {
        setEditingSessionId(sessionId);
        setSessionName(name); // Set current name to input
    };

    const handleNameChange = (event) => {
        setSessionName(event.target.value);
    };

    const handleEditSubmit = (sessionId) => {
        onEditSession(sessionId, sessionName);
        setEditingSessionId(null); // Exit editing mode
        setSessionName(''); // Clear input
    };

    return (
        <div className="session-list-container">
           
            <button className="btn btn-primary" onClick={onNewSession}>New Session</button>
            {sessions.map((session) => (
                <div
                    key={session.id}
                    className={`session-item ${session.id === activeSessionId ? 'active' : ''}`}
                    onClick={() => onSessionClick(session.id)}
                >
                    {editingSessionId === session.id ? (
                        <input
                            type="text"
                            value={sessionName}
                            onChange={handleNameChange}
                            onBlur={() => handleEditSubmit(session.id)} // Submit when focus leaves the input
                            autoFocus
                        />
                    ) : (
                        <p className="session-name">{session.name}</p>
                    )}
                    <button className="edit-session" onClick={(e) => { e.stopPropagation(); handleEditClick(session.id, session.name); }}>
                        {/* SVG for edit icon */}
                        <EditIcon />
                    </button>
                    <button className="delete-session" onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}>
                        {/* SVG for delete icon */}
                       <DeleteIcon />

                    </button>
                </div>
            ))}
        </div>
    );
}

export default SessionList;
