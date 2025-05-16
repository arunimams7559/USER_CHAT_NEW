import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './components/pages/login';
import SignupPage from './components/pages/signup';
import SideBar from './components/pages/sidebar';
import UserList from './components/pages/userlist';

import { UserProvider } from './components/context/usercontext';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/sidebar" element={<SideBar />} />
            <Route path="/userlist"element={<UserList onSelect={(user) => console.log('Selected user:', user)} />}
/>

          </Routes>
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
