import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/usercontext';
import io from 'socket.io-client';
import axios from 'axios';



const socket = io('http://localhost:5000');
(window as any).socket = socket;

interface Message {
  sender: string;
  text: string;
  timestamp: string;
}

interface ChatProps {
  selectedUser: {
    _id: string;
    username: string;
    isOnline?: boolean;
    avatar?: string;
  } | null;
  onToggleUserList: (show?: boolean) => void;
}

const Chat: React.FC<ChatProps> = ({ selectedUser, onToggleUserList }) => {
  const { user } = useUser();
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?._id) {
      socket.emit('user_connected', user._id);
    }

    return () => {
    
    };
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (!user || !selectedUser) return;

    setLoading(true);
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/userauth/messages', {
          params: {
            senderId: user._id,
            receiverId: selectedUser._id,
          },
        });

        const messages = response.data.messages.map((msg: any) => ({
          sender: msg.senderId.username,
          text: msg.content,
          timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));

        setChatMessages(messages);
      } catch (err) {
        console.error('Error fetching chat history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [user, selectedUser]);

  useEffect(() => {
    const receiveMessage = (incomingMessage: Message) => {
      setChatMessages((prevMessages) => [...prevMessages, incomingMessage]);
    };

    socket.on('chat message', receiveMessage);

    return () => {
      socket.off('chat message', receiveMessage);
    };
  }, []);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !user || !selectedUser) return;

    const newMessage: Message = {
      sender: user.username,
      text: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    socket.emit('chat message', newMessage);

    try {
      await axios.post('http://localhost:5000/api/userauth/messages', {
        senderId: user._id,
        receiverId: selectedUser._id,
        content: messageInput,
      });
    } catch (err) {
      console.error('Failed to save message:', err);
    }

    setMessageInput('');
  };  const handleToggleSidebar = (side: 'left' | 'right') => {    
    const rightSidebar = document.querySelector('.chatapp-chat-sidebar-right');
    const overlay = document.querySelector('.chatapp-overlay');
    const profileDetails = document.querySelector('.chatapp-profile-details');    if (side === 'left') {
    
      profileDetails?.classList.toggle('show');
      rightSidebar?.classList.remove('show');
      overlay?.classList.toggle('show');
      onToggleUserList(false); 
    } else {
  
      rightSidebar?.classList.toggle('show');
      profileDetails?.classList.remove('show');
      overlay?.classList.toggle('show');
      onToggleUserList(); 
    }
  };
  const closeAllSidebars = () => {
    const rightSidebar = document.querySelector('.chatapp-chat-sidebar-right');
    const overlay = document.querySelector('.chatapp-overlay');
    const profileDetails = document.querySelector('.chatapp-profile-details');
      rightSidebar?.classList.remove('show');
    profileDetails?.classList.remove('show');
    overlay?.classList.remove('show');
    onToggleUserList(false); 
  };

  if (!selectedUser) {

    return (
      <div className="chatapp-chat-wrapper chatapp-empty-chat">
        <div className="chatapp-empty-chat-state">

          <p>Select a user to start chatting.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chatapp-chat-wrapper">
      <div className="chatapp-chat-header">
        <div className="chatapp-mobile-toggle">
          <div className="chatapp-mobile-toggle-icons">
          
            <button 
              className="chatapp-toggle-icon"
              onClick={() => handleToggleSidebar('left')}
              aria-label="Toggle menu"
            >
              <svg className="chatapp-menu-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            </button>
            
            
            <button 
              className="chatapp-toggle-icon" 
              onClick={() => handleToggleSidebar('right')}
              aria-label="Toggle contacts"
            >
              <svg className="chatapp-menu-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 13c-1.2 0-3.07.34-4.5 1-1.43-.67-3.3-1-4.5-1C5.33 13 1 14.08 1 16.25V19h22v-2.75c0-2.17-4.33-3.25-6.5-3.25zm-4 4.5h-10v-1.25c0-.54 2.56-1.75 5-1.75s5 1.21 5 1.75v1.25zm9 0H14v-1.25c0-.46-.2-.86-.52-1.22.88-.3 1.96-.53 3.02-.53 2.44 0 5 1.21 5 1.75v1.25zM7.5 12c1.93 0 3.5-1.57 3.5-3.5S9.43 5 7.5 5 4 6.57 4 8.5 5.57 12 7.5 12zm0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 5.5c1.93 0 3.5-1.57 3.5-3.5S18.43 5 16.5 5 13 6.57 13 8.5s1.57 3.5 3.5 3.5zm0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="chatapp-chat-user-info">
          <div className="chatapp-chat-user-avatar">
            <img
              src={selectedUser.avatar || 'https://avatar.iran.liara.run/public/boy'}
              alt={selectedUser.username}
            />
            <span className={`chatapp-status-indicator ${selectedUser.isOnline ? 'online' : 'offline'}`}></span>
          </div>
          <div className="chatapp-chat-user-details">
            <h3>{selectedUser.username}</h3>
            <p className={`chatapp-status-text ${selectedUser.isOnline ? 'online' : 'offline'}`}>
              {selectedUser.isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      <div className="chatapp-overlay" onClick={closeAllSidebars}></div>

      
      <div className="chatapp-profile-details">
        {user && (
          <div className="chatapp-profile-content">
            <div className="chatapp-profile-header">
              <h2>Profile</h2>
              <button className="chatapp-close-button" onClick={closeAllSidebars}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            <div className="chatapp-profile-info">
              <div className="chatapp-profile-avatar">
                <img src={user.avatar || 'https://avatar.iran.liara.run/public/boy'} alt={user.username} />
                <span className="chatapp-status-indicator online"></span>
              </div>
              <h3 className="chatapp-profile-name">{user.username}</h3>
              <p className="chatapp-profile-email">{user.email}</p>
              <div className="chatapp-profile-status">
                <span className="chatapp-status-indicator online"></span>
                <span className="chatapp-status-text">Online</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="chatapp-chat-messages">
        {loading ? (
          <div className="chatapp-loading-messages">
            <div className="chatapp-loading-spinner"></div>
            <p>Loading messages...</p>
          </div>
        ) : chatMessages.length === 0 ? (
          <div className="chatapp-no-messages">
            <p> Say hello!</p>
          </div>
        ) : (
          chatMessages.map((msg, index) => {
            const sentByCurrentUser = msg.sender === user?.username;
            return (
              <div
                key={index}
                className={`chatapp-message-bubble ${sentByCurrentUser ? 'sent' : 'received'}`}
              >
                <span className="chatapp-message-text">{msg.text}</span>
                <span className="chatapp-message-meta">{msg.timestamp}</span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatapp-chat-input">
        <input
          type="text"
          placeholder={`Type your Message...`}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage} aria-label="Send message">
          <svg className="chatapp-send-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};
 
export default Chat;