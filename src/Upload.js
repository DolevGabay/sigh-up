import React, { useEffect, useState } from 'react';
import ExcelJS from 'exceljs';
import './Upload.css';

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
    setUploadedFileName(file.name);
  };

  const handleFileChange = (event) => {
    handleFileSelection(event.target.files[0]);
  };

  const handleFileSelection = (file) => {
    setSelectedFile(file);
    setUploadedFileName(file.name);
  };

  useEffect(() => {
    console.log(selectedFile);
  }, [selectedFile]);

  const handleUpload = async () => {
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const buffer = e.target.result;
        const workbook = new ExcelJS.Workbook();
        
        await workbook.xlsx.load(buffer);

        const worksheet = workbook.getWorksheet(1);
        const emailColumn = worksheet.getColumn(1);
        const emailAddresses = emailColumn.values.slice(2); // Skip the header
        console.log(emailAddresses);

        const emailData = {
          to: emailAddresses.map((recipient) => recipient),
          subject: subject,
          text: message,
        };

        try {
          const response = await fetch('http://localhost:3001/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
          });

          if (response.ok) {
            console.log('Emails sent successfully');
          } else {
            console.error('Failed to send emails');
          }
        } catch (error) {
          console.error('Error sending emails:', error);
        }
      };

      reader.readAsArrayBuffer(selectedFile);
    } else {
      console.log('No file selected');
    }
  };

  return (
    <div className='upload'>
        <div style={{ marginTop: '20px' }}>
            <label htmlFor="subject">Subject:</label>
            <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px', borderRadius: '3px' }}
            />
        </div>
        <div style={{ marginTop: '10px' }}>
            <label htmlFor="message">Message:</label>
            <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px', borderRadius: '3px', height: '100px' }}
            />
        </div>
        <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
            border: '2px dashed #008CBA',
            borderRadius: '5px',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
            margin: '50px auto',
            maxWidth: '300px',
        }}
        >
        <h2>Drag and Drop File</h2>
        <input
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
        />
        <p>or</p>
        <label htmlFor="fileInput" style={{ background: '#008CBA', color: '#fff', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>
            Select a File
        </label>
        
        <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            style={{ display: 'none' }}
        />
        {uploadedFileName && (
            <p style={{ marginTop: '10px', color: '#333' }}>
            Uploaded File: {uploadedFileName}
            </p>
        )}
        </div>
        <button onClick={handleUpload} style={{ background: '#008CBA', color: '#fff', padding: '10px', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
        Upload
    </button>
  </div>
  );
};

export default Upload;
