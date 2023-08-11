import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { push, ref } from 'firebase/database';
import { db } from '../firebase';
import './Welcome.css';

const Welcome = () => {
  const user = useSelector((state) => state.auth.user);
  const [receiver, setReceiver] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  const handleSendEmail = (e) => {
    e.preventDefault();

    const emailData = {
      receiver,
      subject,
      content,
      sender: user.email, 
    };

    const emailsRef = ref(db, 'emails');
    push(emailsRef, emailData)
      .then(() => {
        setReceiver('');
        setSubject('');
        setContent('');
      })
      .catch((error) => {
        console.log('Error sending email:', error);
      });
  };

  return (
    <div className="welcome-container">
      <div className="compose-email-container">
        <h2>Compose Email</h2>
        <form onSubmit={handleSendEmail}>
          <label htmlFor='to'>Send To:</label>
          <input
            type="text"
            placeholder="Receiver"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
          />
          <br/>
          <label htmlFor='subject'>Subject: </label>
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <br/>
          <label htmlFor='content'>Message: </label>
          <ReactQuill value={content} onChange={(value) => setContent(value)} />
          <button type="submit">Send Email</button>
        </form>
      </div>
    </div>
  );
};

export default Welcome;
