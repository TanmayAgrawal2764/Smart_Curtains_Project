import React, { useState } from 'react';

function Contact(props) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  function handleChange(event) {
    setFormData(prev => ({
      ...prev,
      [event.target.id]: event.target.value
    }));
  }

  function showDropdown() {
    console.log("show");
    setIsDropdownVisible(true);
  }

  function hideDropdown() {
    setIsDropdownVisible(false);
  }

  function handleDropdownClick(event) {
    const input = document.getElementById('query-input');
    input.value = event.target.innerText;
    hideDropdown();
  }

  return (
    <div
      id="slider"
      style={
        props.slide === 1
          ? { transition: 'right 0.5s ease-in-out', right: '0', overflow: 'hidden' }
          : { transition: 'right 0.5s ease-in-out', right: '-360px', overflow: 'hidden' }
      }
    >
      <div id="header">
        <h2 onClick={props.here}>
          <i
            id="Cross"
            style={{ marginLeft: '-300px', cursor: 'pointer' }}
            className="fas fa-times"
          ></i>
        </h2>
        <h2 style={{ marginTop: '-43px' }}>Contact Us</h2>
        <p>Please fill out the form below and we will get back to you as soon as possible.</p>
        <form id="contact-form">
          <input
            name="dname"
            type="text"
            placeholder="Enter Name"
            id="name"
            onChange={handleChange}
            required
          />
          <input
            name="demail"
            type="text"
            placeholder="Enter Email"
            id="email"
            onChange={handleChange}
            required
          />
          <h4>Query Type</h4>
          <div className="custom-select-container">
            <input
              type="text"
              id="query-input"
              placeholder="Select Query"
              onFocus={showDropdown}
              autoComplete="off"
              required
            />
            {isDropdownVisible &&
            (
              <div className="custom-select-dropdown" id="query-dropdown" onClick={handleDropdownClick}>
                <div>General</div>
                <div>Technical</div>
                <div>Form</div>
                <div>Data</div>
              </div>
            )}
          </div>
          <textarea
            id="message"
            placeholder="Your Message"
            onChange={handleChange}
            required
          />
          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
