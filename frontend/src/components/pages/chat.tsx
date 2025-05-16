import React, { useEffect, useRef, useState } from 'react';
import '../style/chat.css';

interface Message {
  sender: string;
  receiver: string;
  text: string;
  timestamp: string;
}


interface Props {
  selectedUser: string | null;
  selectedUserData?: {
    username: string;
    email: string;
    avatar?: string;
    isOnline?: boolean;
    _id?: string;
  } | null;
  messages: Message[];
  onSendMessage: (message: string) => void;
  currentUser?: string;
}

const ChatWindow: React.FC<Props> = ({
  selectedUser,
  selectedUserData,
  messages,
  onSendMessage,
  currentUser
}) => {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

 
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() && selectedUser) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="chat-window">
    
      <div className="chat-header">
        {selectedUser && selectedUserData ? (
          <div className="user-info">
            <img
              src={selectedUserData.avatar || 'https://avatar.iran.liara.run/public/boy'}
              alt="avatar"
              className="avatar"
            />
            <div>
              <strong>{selectedUserData.username}</strong>
              <div>{selectedUserData.isOnline ? 'Online' : 'Offline'}</div>
            </div>
          </div>
        ) : (
          <div>Select a user to chat with</div>
        )}
      </div>

  
      <div className="chat-messages">
        {!selectedUser && (
          <div className="welcome">
            <h3>Welcome to ChatApp</h3>
            <p>Select a user from the list to start chatting.</p>
          </div>
        )}

        {selectedUser && messages.length === 0 && (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-bubble ${msg.sender === currentUser ? 'sent' : 'received'}`}
          >
            <div>{msg.text}</div>
            <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

     
      {selectedUser && (
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
