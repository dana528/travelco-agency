// Routes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import UserProfile from './UserProfile';
import EmailVerification from './EmailVerification';
import Main from './Main';



const Routs = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/:userId' element={<EmailVerification /> } />
      <Route path='/:userId/login' element={<Main /> } /> 
      <Route path="/:userId/:email" element={<UserProfile /> } />
      <Route path='/' element={<Home />} />
      
    </Routes>
  );
}

export default Routs;
