// src/components/UploadDoc.jsx
import React, { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
import './UploadDoc.css';

const UploadDoc = () => {
    const [files, setFiles] = useState(Array(7).fill(null)); // Array for 7 inputs
    const [previews, setPreviews] = useState(Array(7).fill(null)); // Array for file previews
    const [progress, setProgress] = useState(Array(7).fill(0)); // Progress for each file
    const [statusMessage, setStatusMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const storage = getStorage();
    const navigate = useNavigate();

    // Array of unique names for each file input
    const fileNames = [
        "AADHAR",
        "PANCARD",
        "DRIVING LICINCE",
        "CASTE CERTIFICATE",
        "INCOME CERTIFICATE",
        "PUC CERTIFICATE",
        "DEGREE CERTIFICATE"
    ];

    const handleFileChange = (index) => (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const updatedFiles = [...files];
            updatedFiles[index] = selectedFile;
            setFiles(updatedFiles);
            
            // Create a preview
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedPreviews = [...previews];
                updatedPreviews[index] = reader.result;
                setPreviews(updatedPreviews);
            };
            reader.readAsDataURL(selectedFile); // Create a preview for images
            setStatusMessage(''); // Clear status message on file selection
        }
    };

    const handleUpload = (index) => {
        const file = files[index];
        if (!file) {
            setStatusMessage(`No file selected for ${fileNames[index]}`);
            return;
        }

        setStatusMessage(`Uploading ${fileNames[index]}...`);
        setLoading(true);
        const storageRef = ref(storage, `documents/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                const updatedProgress = [...progress];
                updatedProgress[index] = uploadProgress; // Update progress for the specific file
                setProgress(updatedProgress);
                console.log(`Upload progress for ${file.name}: ${uploadProgress}%`);
            },
            (error) => {
                console.error('Upload error:', error.message);
                setStatusMessage(`Upload failed for ${fileNames[index]}: ${error.message}`);
                setLoading(false);
            },
            () => {
                console.log('Upload completed successfully');
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        console.log('Download URL retrieved:', downloadURL);
                        setStatusMessage(`Upload successful for ${fileNames[index]}! File available at: ${downloadURL}`);
                    })
                    .catch((error) => {
                        console.error('Error getting download URL:', error.message);
                        setStatusMessage('Failed to retrieve download URL');
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }
        );
    };

    const handleUploadMoreFiles = () => {
        navigate('/share');
    };

    return (
        <div className='upload-doc'>
            <h2>Upload Documents</h2>

            {files.map((_, index) => (
                <div key={index}>
                    <h2>{fileNames[index]}</h2> {/* Unique heading for each file input */}
                    
                    
                    {/* Preview Section */}
                    {previews[index] && (
                        <div className="preview">
                            {files[index] && files[index].type.startsWith('image/') ? (
                                <img src={previews[index]} alt={`Preview of ${files[index].name}`} style={{ maxWidth: '200px', maxHeight: '200px' }} />
                            ) : (
                                <p>{files[index].name}</p>
                            )}
                        </div>
                    )}
                    <input type="file" onChange={handleFileChange(index)} />
                    <div>
                        <progress value={progress[index]} max="100" />
                        <span>{Math.round(progress[index])}%</span>
                    </div>
                    <button onClick={() => handleUpload(index)} disabled={loading || !files[index]}>
                        Upload {fileNames[index]}
                    </button>
                    
                </div>
            ))}
            <p>{statusMessage}</p>
            <button onClick={handleUploadMoreFiles}>Upload More Files</button>
        </div>
    );
};

export default UploadDoc;
