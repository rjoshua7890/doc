// // src/components/ShareDoc.js
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './ShareDoc.css';

// const ShareDoc = () => {
//     const [email, setEmail] = useState('');
//     const [docName, setDocName] = useState('');
//     const navigate = useNavigate();

//     const handleShare = () => {
//         alert(`Document ${docName} shared with ${email}`);
//     };

//     return (
//         <div className="share-doc-container">
//             <h2 className="share-doc-header">Share Document</h2>
//             <div className="share-doc-inputs">
//                 <input
//                     type="text"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="Recipient Email"
//                 />
//                 <input
//                     type="text"
//                     value={docName}
//                     onChange={(e) => setDocName(e.target.value)}
//                     placeholder="Document Name"
//                 />
//             </div>
//             <button className="share-doc-button" onClick={() => { handleShare(); navigate('/upload'); }}>Upload</button>
//             <button className="share-doc-button" onClick={() => { handleShare(); navigate('/share'); }}>Share</button>
//             <button className="share-doc-button share-doc-manage-button" onClick={() => { handleShare(); navigate('/manage'); }}>Manage</button>
//         </div>
//     );
// };

// export default ShareDoc;

// src/components/ShareDoc.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../firebase'; // Ensure you've initialized Firebase storage
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import './ShareDoc.css';

const ShareDoc = () => {
    const [email, setEmail] = useState('');
    const [selectedFile, setSelectedFile] = useState('');
    const [fileList, setFileList] = useState([]);
    const navigate = useNavigate();

    // Fetch file names from Firebase Storage
    useEffect(() => {
        const fetchFiles = async () => {
            const listRef = ref(storage, 'documents'); // Change to your storage path
            const res = await listAll(listRef);
            const files = res.items.map(item => item.name);
            setFileList(files);
        };

        fetchFiles().catch(console.error);
    }, []);

    const handleShare = async () => {
        if (!selectedFile || !email) {
            alert('Please select a file and enter an email.');
            return;
        }

        alert(`Document ${selectedFile} shared with ${email}`);

        //Enable below code to share email. To share file create a billing account and use firebase function
        // Create a storage reference for the selected file
        // const fileRef = ref(storage, `documents/${selectedFile}`);
        
        // // Get the download URL
        // try {
        //     const downloadURL = await getDownloadURL(fileRef);

        //     // Send the email with the file URL
        //     const response = await fetch('https://<your-cloud-function-url>', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             email,
        //             docName: selectedFile,
        //             downloadURL,
        //         }),
        //     });

        //     if (response.ok) {
        //         alert(`Document ${selectedFile} shared with ${email}`);
        //     } else {
        //         throw new Error('Failed to send email.');
        //     }
        // } catch (error) {
        //     alert(`Error: ${error.message}`);
        // }
    };

    return (
        <div className="share-doc-container">
            <h2 className="share-doc-header">Share Document</h2>
            <div className="share-doc-inputs">
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Recipient Email"
                />
                <select onChange={(e) => setSelectedFile(e.target.value)} value={selectedFile}>
                    <option value="">Select a document</option>
                    {fileList.map((fileName, index) => (
                        <option key={index} value={fileName}>
                            {fileName}
                        </option>
                    ))}
                </select>
            </div>
            <button className="share-doc-button" onClick={() => { navigate('/upload'); }}>Upload</button>
            <button className="share-doc-button" onClick={handleShare}>Share</button>
            <button className="share-doc-button" onClick={() => navigate('/manage')}>Manage</button>

            <h3>Available Documents:</h3>
            <ul>
                {fileList.map((fileName, index) => (
                    <li key={index}>{fileName}</li>
                ))}
            </ul>
        </div>
    );
};

export default ShareDoc;
