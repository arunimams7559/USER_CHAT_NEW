import React, { useState } from 'react';
import Sidebar from './sidebar';
import UserList from './userlist';
import Chat from './chat';
import '../style/chatpage.css';

interface SelectedUser {
  _id: string;
  username: string;
  isOnline?: boolean;
  avatar?: string;
}

const ChatPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showUserList, setShowUserList] = useState(false);


  const handleSelectUser = (user: SelectedUser) => {
    setSelectedUser(user);
    setShowUserList(false);
    const overlay = document.querySelector('.chatapp-overlay');
    const rightSidebar = document.querySelector('.chatapp-chat-sidebar-right');
    overlay?.classList.remove('show');
    rightSidebar?.classList.remove('show');
  };  const toggleUserList = (show?: boolean) => {
    if (show !== undefined) {
      setShowUserList(show);
    } else {
      setShowUserList(prev => !prev);
    }
    setShowSidebar(false);
    

    const overlay = document.querySelector('.chatapp-overlay');
    if (show === undefined) {
      overlay?.classList.toggle('show');
    } else {
      if (show) {
        overlay?.classList.add('show');
      } else {
        overlay?.classList.remove('show');
      }
    }
  };

  return (
    <div className="chatapp-chat-page">
      <div className={`chatapp-chat-sidebar-left${showSidebar ? ' show' : ''}`}>
        <Sidebar />
      </div>      <div className="chatapp-chat-main">
        <Chat
          selectedUser={selectedUser}
          onToggleUserList={toggleUserList}
        />
      </div>

      <div className={`chatapp-chat-sidebar-right${showUserList ? ' show' : ''}`}>
        <UserList
          onSelectUser={handleSelectUser}
          selectedUser={selectedUser}
        />
      </div>
    </div>
  );
};

export default ChatPage;