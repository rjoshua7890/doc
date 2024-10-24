// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { updateProfile } from 'firebase/auth'; // Import updateProfile
import './Profile.css';

const Profile = () => {
    const [login, setlogin] = useState(null);
    const [name, setName] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((login) => {
            if (login) {
                setlogin(login);
                setName(login.displayName || ''); // Set display name if available
            } else {
                setlogin(null);
                setName(''); // Reset name when login logs out
            }
        });

        return () => unsubscribe();
    }, []);

    const handleUpdateProfile = async () => {
        if (login) {
            try {
                await updateProfile(login, {
                    displayName: name,
                });
                alert('Profile updated successfully');
            } catch (error) {
                console.error('Profile update error:', error.message);
                alert('Profile update failed: ' + error.message);
            }
        }
    };

    return (
        <div className='profile'>
            <h2>My Profile</h2>
            {login ? (
                <div>
                    <p><strong>Email:</strong> {login.email}</p>
                    <p><strong>Name:</strong> {name || 'Not set'}</p> {/* Display the name */}
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        style={{ marginBottom: '10px', padding: '8px', width: '200px' }}
                    />
                    <button
                        onClick={handleUpdateProfile}
                        style={{ padding: '8px 16px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Update Profile
                    </button>
                </div>
            ) : (
                <p>Please log in</p>
            )}
        </div>
    );
};

export default Profile;
