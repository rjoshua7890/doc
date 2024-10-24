// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VerifyOTP from './components/VerifyOTP';
import Login from './components/Login';
import UploadDoc from './components/UploadDoc';
import ManageDoc from './components/ManageDoc';
import ShareDoc from './components/ShareDoc';
import Profile from './components/Profile';
import './App.css'
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
    return (
        <>
        <Header/>
        <Router>
            <div>
                <Routes>
                    {/* <Route path="*" element={<h1>Welcome to Document Management System</h1>} /> */}
                    <Route path="/verify" element={<VerifyOTP />} />
                    <Route path="/" element={<Login />} />
                    <Route path="/upload" element={<UploadDoc />} />
                    <Route path="/manage" element={<ManageDoc />} />
                    <Route path="/share" element={<ShareDoc />} />
                    <Route path="/my-profile" element={<Profile />} />    
                </Routes>
                
            </div>
        </Router>
        <Footer/>
        </>
    );
}

export default App;
