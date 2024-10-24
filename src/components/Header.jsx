import React from 'react';
import './Header.css'
import { assets } from '../assets/assets';

const Header = () => {
  return (
    <div className='header'>
    <div className="header-contents"> 
        <img src={assets.l} alt=''/>   
    <h1>Welcome To The Upload and Share Documents</h1>
      <p>Share and Store For Future use</p>
      </div>
  </div>
  );
}

export default Header;
