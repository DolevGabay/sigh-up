import React, { useState } from 'react';
import './Sign-in.css';
import axios from 'axios';


const SignInForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    consent: true, // Default value for the checkbox
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can perform actions with the form data here
    console.log('Form data submitted:', formData);
    addEmailToMongo(formData.email);
  };

  const addEmailToMongo = async (email) => {
    try {
      await axios.post('http://18.153.73.183:5001/addEmail', { email });
      console.log('Email added to MongoDB successfully');
    } catch (error) {
      console.error('Error adding email to MongoDB:', error);
    }
  };
  
  const handleMangeClick = () => {
    // Replace 'yourPassword' with your desired password
    const enteredPassword = prompt('Enter the password:');
    const correctPassword = 'niki'; // Replace with the actual password
  
    if (enteredPassword === correctPassword) {
      window.location.href = '/upload';
    } else {
      alert('Incorrect password. Access denied.');
    }
  };
  

  return (
    <div className="modal">
      <div className="modal__container">
        <div className="modal__featured">
          <button type="button" className="button--transparent button--close">
            <svg className="nc-icon glyph" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32">
              <g><path fill="#ffffff" d="M1.293,15.293L11,5.586L12.414,7l-8,8H31v2H4.414l8,8L11,26.414l-9.707-9.707 C0.902,16.316,0.902,15.684,1.293,15.293z"></path> </g>
            </svg>
            <span className="visuallyhidden">Return to Product Page</span>
          </button>
          <img id="myImage" src={require('./i-love-phone.jpeg')} className="modal__product" alt="Payment Product" />
        </div>
        <div className="modal__content">
          <h2>הירשם וקבל 5% הנחה</h2>
          <form onSubmit={handleSubmit}>
            <ul className="form-list">
              <li className="form-list__row">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </li>
              <li className="form-list__row">
                <label>Email</label>
                <input type="text" name="email" value={formData.email} onChange={handleChange} required />
              </li>
              <li className="form-list__row form-list__row--agree">
                <label>
                    <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    required  
                    />
                    I give my consent to be in touch with me via email using the information I have provided in this form for the purpose of news, updates, and marketing.
                </label>
                </li>
              <li>
                <button type="submit" className="button">Submit</button>
              </li>
            </ul>
          </form>
        </div> 
      </div> 
        <button type="button" className="button button--manage-board" onClick={handleMangeClick}>
          Manage Board
        </button>
        <button type="button" className="button1 button--manage-board" onClick={handleMangeClick}>
          Manage dddd
        </button>
    </div> 
  );
};

export default SignInForm;
