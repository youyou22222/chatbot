import React, { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../constants/constants';
import ReactMarkdown from 'react-markdown'; // Import the react-markdown library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import gfm from 'remark-gfm';


import userAvatar from '../assets/user.png';
import partnerAvatar from '../assets/gpt.png';

import '../styles/MessageList.css'
import '../styles/MarkDown.css'

function MessageList({ activeSessionId, setActiveSessionId, createNewSession, addNewSession,  socket }) {
    const [userMessage, setUserMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false); // 新状态用于跟踪是否正在尝试提交



    const activeSessionIdRef = useRef(activeSessionId);

    useEffect(() => {
	    // 如果用户尝试提交且会话ID有效，则发送消息
	    if (isSubmitting && activeSessionId && userMessage.trim()) {
		// Emit the message to the server
		socket.emit('send message', { userMessage: processMessageForMarkdown(userMessage), sessionId: activeSessionId });

		// Update the local messages state immediately with the user's message
		setMessages(prevMessages => [...prevMessages, { content: userMessage, role: 'user' }]); // Adjust the object structure as per your needs

		// Clear the input
		setUserMessage('');

		// Reset submitting state
		setIsSubmitting(false);
	    }
	}, [isSubmitting, activeSessionId, userMessage, socket]); // 依赖列表中确保包含所有使用到的状态和props

    
	useEffect(() => {
		    console.log('returned messages:', messages);
	}, [messages]);

    useEffect(() => {
        activeSessionIdRef.current = activeSessionId;
    }, [activeSessionId]);

    useEffect(() => {
        const handleNewMessage = (data) => {
            console.log("data", data)
            if (data.sessionId === activeSessionIdRef.current) {
                setMessages(prevMessages => [...prevMessages, ...data.messages]);
            }
        };

        if (socket) {
            socket.on('new message', handleNewMessage);
        }

        return () => {
            if (socket) {
                socket.off('new message', handleNewMessage);
            }
        };
    }, [socket]);

    useEffect(() => {
        if (activeSessionId) {
            fetchHistoricalMessages(activeSessionId);
        } else {
            setMessages([]);  // Clear messages if there's no active session
        }
    }, [activeSessionId]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // 阻止默认行为，这里是换行
            handleSubmit(e);  // 触发表单提交事件
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
	
	// 如果已经有活动会话，直接设置提交状态以触发上面的 useEffect
	    if (activeSessionId) {
		    setIsSubmitting(true);
		    return;
	    }

	    // 如果没有活动会话，创建新会话
	    const newSessionId = await createNewSession();
	    if (newSessionId) {
		    setIsSubmitting(true); // 设置提交状态以触发上面的 useEffect
	    } else {
		// 如果创建会话失败，通知用户并停止发送消息
		    alert("无法创建新会话，请稍后再试。");
	    }

    };

    const fetchHistoricalMessages = async (sessionId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/get-messages/${sessionId}`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch historical messages for session ${sessionId}`);
            }

            const data = await response.json();
            setMessages(data || []);
        } catch (error) {
            console.error("Error fetching historical messages:", error);
            // TODO: Handle this error in a user-friendly way, maybe set an error state and display a message.
        }
    };

    const processMessageForMarkdown = (message) => {
        // 在每个换行符前添加两个空格
        return message.replace(/\n/g, "  \n");
    };

    return (
        <div className="message-page-container">
            {/* 渲染消息的区域 */}
            <div className="messages-container" style={{ marginBottom: "160px" }}> 
                {messages.map((message) => (
                        
                        <div key={message._id} className={`message ${message.role}`}> {/* 这里使用索引作为 key，如果您有更稳定的唯一ID，请使用它 */}
                                {/* 根据消息角色使用不同的头像 */}
                                <img 
                                    src={message.role === 'user' ? userAvatar : partnerAvatar} 
                                    alt="avatar" 
                                    className={`avatar ${message.role}`} 
                                />
                                <ReactMarkdown 
                                    className="message-content" 
                                    remarkPlugins={[gfm]}
                                    children={message.content} 
                                />
                        </div>
                       
                    
                ))}
            </div>
            {/* 页面底部的输入区 */}
                <div className="input-container" style={{ position: "absolute", bottom: 0, width: "100%", padding: "10px", backgroundColor: "white" }}>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <textarea
                                className="form-control"
                                style={{ resize: "none" }} // 阻止用户调整大小
                                rows="1" 
                                value={userMessage}
                                onChange={e => setUserMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="输入消息（按Enter发送，Shift+Enter换行）"
                            />
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary" type="submit" style={{ border: "none", background: "none" }}>
                                    <FontAwesomeIcon icon={faPaperPlane} /> {/* 使用图标 */}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

        </div>
    );
}

export default MessageList;
