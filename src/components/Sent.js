import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { onValue, query, orderByChild, equalTo, ref, off } from 'firebase/database';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import './Sent.css';

const Sent = () => {
  const user = useSelector((state) => state.auth.user);
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    const emailsRef = ref(db, 'emails');
    const userSentEmailsQuery = query(emailsRef, orderByChild('sender'), equalTo(user.email));

    onValue(userSentEmailsQuery, (snapshot) => {
      if (snapshot.exists()) {
        const emailData = snapshot.val();
        const emailList = Object.keys(emailData).map((key) => ({
          id: key,
          ...emailData[key],
        }));
        setEmails(emailList);
      } else {
        setEmails([]);
      }
    });
    return () => {
      off(userSentEmailsQuery);
    };
  }, [user.email]);

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
  };

  const renderEmailList = () => {
    return emails.map((email) => (
      <li key={email.id} className={`email-item ${selectedEmail === email ? 'selected' : ''}`} onClick={() => handleEmailClick(email)}>
        <Link to={`/inbox/${email.id}`}>
            <div className="email-info">
                <p className="email-receiver">To: {email.receiver}</p>
                <p className="email-subject">Subject: {email.subject}</p>
            </div>
        </Link>
      </li>
    ));
  };

  return (
    <div className="sent-container">
      <h2>Sent</h2>
      <div className="email-list-container">
        <ul className="email-list">{renderEmailList()}</ul>
      </div>
      {selectedEmail && (
        <div className="email-content">
          <h3 className="email-subject">Subject: {selectedEmail.subject}</h3>
          <p className="email-receiver">To: {selectedEmail.receiver}</p>
          <Link to={`/sent/${selectedEmail.id}`} className="email-link">View Details</Link>
        </div>
      )}
    </div>
  );
};

export default Sent;
