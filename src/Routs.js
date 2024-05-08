// Routes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import UserProfile from './UserProfile';
import EmailVerification from './EmailVerification';
import Main from './Main';
import Admin from './Admin';
import User from './User'



const Routs = () => {
  return (
    <Routes>
      <Route path="/:userId/login" element={<Main />} />
      <Route path="/:userId/:email" element={<UserProfile />} />
      <Route path="/:userId" element={< User/>} />
      <Route path="/" element={<Admin />} />
    </Routes>
  );
}

export default Routs;
