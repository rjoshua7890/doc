// // src/components/ManageDoc.js
// import React, { useState } from 'react';
// import {  getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
// import './ManageDoc.css';

// const ManageDoc = () => {
//     const [docName, setDocName] = useState('');
//     const storage = getStorage();

//     const handleDelete = async () => {
//         try {
//             const desertRef = ref(storage, `documents/${docName}`);
//             //await storage.ref(`documents/${docName}`).delete();
//             deleteObject(desertRef).then(() => {
//                 alert('Document deleted');
//               }).catch((error) => {
//                 console.log(error);
//               });
            
//         } catch (error) {
//             console.error(error.message);
//             alert('Deletion failed');
//         }
//     };

//     return (
//         <div className='manage'>
//             <h2>Manage Document</h2>
//             <input type="text" value={docName} onChange={(e) => setDocName(e.target.value)} placeholder="Document Name" />
//             <button onClick={handleDelete}>Delete Document</button>
//         </div>
//     );
// };

// export default ManageDoc;


// src/components/ManageDoc.js
import React, { useState, useEffect } from 'react';
import { getStorage, ref, listAll, deleteObject } from "firebase/storage";
import './ManageDoc.css';

const ManageDoc = () => {
    const [docName, setDocName] = useState('');
    const [fileNames, setFileNames] = useState([]);
    const storage = getStorage();

    useEffect(() => {
        const fetchFileNames = async () => {
            const listRef = ref(storage, 'documents/');
            try {
                const res = await listAll(listRef);
                const names = res.items.map(item => item.name);
                setFileNames(names);
            } catch (error) {
                console.error('Error fetching file names:', error);
            }
        };

        fetchFileNames();
    }, [storage]);

    const handleDelete = async () => {
        try {
            const desertRef = ref(storage, `documents/${docName}`);
            await deleteObject(desertRef);
            alert('Document deleted');
            // Refresh the file list after deletion
            setFileNames(prev => prev.filter(name => name !== docName));
        } catch (error) {
            console.error(error.message);
            alert('Deletion failed');
        }
    };

    return (
        <div className='manage'>
            <h2>Manage Document</h2>
            <input type="text" value={docName} onChange={(e) => setDocName(e.target.value)} placeholder="Document Name" />
            <button onClick={handleDelete}>Delete Document</button>
            <h3>Existing Documents:</h3>
            <ul>
                {fileNames.map((name, index) => (
                    <li key={index}>{name}</li>
                ))}
            </ul>
        </div>
    );
};

export default ManageDoc;
