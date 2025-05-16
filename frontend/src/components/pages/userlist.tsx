import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  _id?: string;
  id?: string;
  username: string;
  email: string;
  avatar?: string;
  isOnline?: boolean;
}

interface Props {
  onSelect: (user: User) => void;
}

const UserList: React.FC<Props> = ({ onSelect }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/auth/users`);
        setUsers(response.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };

    fetchUsers();
    
  
    const interval = setInterval(fetchUsers, 30000);
    
    return () => clearInterval(interval);
  }, []);
    const handleSelectUser = (user: User) => {
    setSelectedUserId(user._id || user.id || null);
    onSelect(user);
  };
  
  const filteredUsers = searchTerm 
    ? users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      ) 
    : users;

  return (
    <div className="user-list">
      <div className="user-list-header">
        <h3>Contacts</h3>
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      {filteredUsers.length === 0 && (
        <div className="empty-list">
          <p>No users found</p>
        </div>
      )}
      
      {filteredUsers.map((user, index) => (
        <div 
          className={`user-item ${(user._id || user.id) === selectedUserId ? 'active' : ''}`} 
          key={user._id || index} 
          onClick={() => handleSelectUser(user)}
        >
          <div className="user-avatar">           
             <img 
              src={user.avatar || 'https://avatar.iran.liara.run/public/boy'} 
              alt="avatar" 
              className="avatar small" 
            />
            {user.isOnline && <span className="online-indicator"></span>}
          </div>
          <div className="user-info">
            <strong>{user.username}</strong>
            <p>{user.email}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
