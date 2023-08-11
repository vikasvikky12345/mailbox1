import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { onValue, query, orderByChild, equalTo, ref, off, remove } from 'firebase/database';
import { fetchEmails, markAsRead, deleteEmail } from '../../mailbox/src/inboxSlice';
import { db } from '../../mailbox/src/firebase';
import { Link } from 'react-router-dom';
import './Inbox.css';

const Inbox = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [emails, setEmails] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const userEmailsQueryRef = useRef(null);

  useEffect(() => {
    const fetchUserEmails = async () => {
      if (user && user.email) {
        const emailsRef = ref(db, 'emails');
        const queryRef = query(emailsRef, orderByChild('receiver'), equalTo(user.email));

        userEmailsQueryRef.current = queryRef;

        onValue(queryRef, (snapshot) => {
          if (snapshot.exists()) {
            const emailData = snapshot.val();
            const emailList = Object.keys(emailData).map((key) => ({
              id: key,
              ...emailData[key],
            }));
            setEmails(emailList);
            updateUnreadCount(emailList);
          } else {
            setEmails([]);
            updateUnreadCount([]);
          }
        });

        dispatch(fetchEmails(user.email));
        console.log('User:', user);
      }
    };

    const updateUnreadCount = (emails) => {
      const count = emails.reduce((acc, email) => {
        return acc + (email.read ? 0 : 1);
      }, 0);
      setUnreadCount(count);
    };

    fetchUserEmails();

    return () => {
      if (userEmailsQueryRef.current) {
        off(userEmailsQueryRef.current);
      }
    };
  }, [user, dispatch]);

  const handleEmailClick = (emailId) => {
    if (!emails.find((email) => email.id === emailId)) {
      return;
    }

    dispatch(markAsRead(emailId));
  };

  const handleDeleteEmail = async (emailId) => {
    try {
      await dispatch(deleteEmail(emailId));
      console.log('Email deleted:', emailId);
    } catch (error) {
      console.log('Delete email error:', error.message);
    }
  };

  return (
    <div className="inbox-container">
      <h2>Inbox</h2>
      <div className="email-list-container">
        <ul className="email-list">
          {emails.map((email) => (
            <li key={email.id} className={`email-item ${email.read ? 'read' : 'unread'}`}>
              <div className="email-info">
                <button onClick={() => handleDeleteEmail(email.id)}>Delete</button>
                <Link to={`/inbox/${email.id}`} onClick={() => handleEmailClick(email.id)}>
                  <p className="email-subject">Subject: {email.subject}</p>
                  <p className="email-sender">From: {email.sender}</p>
                  {!email.read && <div className="blue-dot" />}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Inbox;
