import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { onValue, ref, off } from 'firebase/database';
import { db } from '../firebase';
import { useParams } from 'react-router-dom';

const InboxEmailDetails = () => {
  const user = useSelector((state) => state.auth.user);
  const [email, setEmail] = useState(null);
  const { emailId } = useParams();

  useEffect(() => {
    const emailRef = ref(db, `emails/${emailId}`);
    onValue(emailRef, (snapshot) => {
      if (snapshot.exists()) {
        const emailData = snapshot.val();
        setEmail(emailData);
      } else {
        setEmail(null);
      }
    });

    return () => {
      off(emailRef);
    };
  }, [emailId]);

  if (!email) {
    return <p>Loading...</p>;
  }

  return (
    <div className="email-details-container">
      <h2>Email Details</h2>
      <div className="email-details">
        <p className="email-subject">Subject: {email.subject}</p>
        <p className="email-sender">From: {email.sender}</p>
        <p className="email-text">{email.content}</p>
      </div>
    </div>
  );
};

export default InboxEmailDetails;
