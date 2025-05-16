import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '.././context/usercontext';


const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const handleLogout = () => {
    setUser(null); 
    navigate('/login');
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="sidebar">
      <div className="app-logo">
        <h2>ChatApp</h2>
      </div>

      <div className="user-profile">
        <img
          src={user.avatar || 'https://avatar.iran.liara.run/public/boy'}
          alt="avatar"
          className="avatar"
        />
        <h3>{user.username}</h3>
        <p>{user.email}</p>
        {user.isOnline && <span className="online-indicator">●</span>}
      </div>

      <div className="sidebar-menu">
        <button className="menu-item active">
          <span className="menu-icon">💬</span>
          <span>Messages</span>
        </button>
        <button className="menu-item">
          <span className="menu-icon">👥</span>
          <span>Contacts</span>
        </button>
        <button className="menu-item">
          <span className="menu-icon">⚙️</span>
          <span>Settings</span>
        </button>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
};

export default Sidebar;
