import React, { useState } from 'react';
import './Upload.css';

const Upload = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [emails, setEmails] = useState([]);
  const [showEmails, setShowEmails] = useState(false);

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendClick = async () => {
    try {
      // Check if subject and message are not empty
      if (!subject.trim() || !message.trim()) {
        alert('Subject and message cannot be empty');
        return;
      }
  
      const response = await fetch('http://18.153.73.183:5001/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: subject,
          text: message,
        }),
      });
  
      if (response.ok) {
        console.log('Email sent successfully');
        alert('Email sent successfully');
      } else {
        console.error('Failed to send email:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  

  const handleShowEmails = async () => {
    try {
      const response = await fetch('http://18.153.73.183:5001/get-emails');
  
      if (response.ok) {
        const emails = await response.text();
        console.log('Emails retrieved from server:', emails);
        setEmails(emails.split(', '));
        setShowEmails(true);
      } else {
        console.error('Failed to retrieve emails:', response.statusText);
      }
    } catch (error) {
      console.error('Error retrieving emails:', error);
    }
  };

  const handleDeleteClick = async (index) => {
    try {
      const email = emails[index];
      const response = await fetch('http://18.153.73.183:5001/delete-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });
  
      if (response.ok) {
        console.log('Email deleted successfully');
        emails.splice(index, 1);
        setEmails([...emails]); 
      }
       else {
        console.error('Failed to delete email:', response.statusText);
      }
    }
    catch (error) {   
      console.error('Error deleting email:', error);
    }
  };

  const handleCloseClick = () => {
    setShowEmails(false);
    setEmails([]); // Optionally clear the emails array
  };

  const handleFormButtonClick = () => {
    window.location.href = '/';
  }

  return (
    <div>
    <button id="signInFormButton" onClick={handleFormButtonClick}>
        Back
      </button>
    <div className="upload-container">
      <h2>Upload Component</h2>
      <div className="form-group">
        <label htmlFor="subject">Subject:</label>
        <input
          type="text"
          id="subject"
          value={subject}
          onChange={handleSubjectChange}
          placeholder="Enter the subject"
        />
      </div>
      <div className="form-group">
        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          value={message}
          onChange={handleMessageChange}
          placeholder="Enter your message"
        />
      </div>
      <button onClick={handleSendClick}>Send</button>
      <button id="showEmailsButton" onClick={handleShowEmails}>
        Show emails
      </button>
      {/* Display emails */}
      {showEmails && (
        <div className="email-list">
          <h3>Emails:</h3>
          <ul>
            {emails.map((email, index) => (
              <li key={index}>
                {email}
                <button onClick={() => handleDeleteClick(index)}>Delete</button>
              </li>
            ))}
          </ul>
          <button id="closeButton" onClick={handleCloseClick}>
            Close
          </button>
        </div>
      )}
    </div>
    </div>
  );
};

export default Upload;
