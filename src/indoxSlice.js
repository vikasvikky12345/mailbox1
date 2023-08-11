import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ref, update, get, remove, onValue, off,query,orderByChild,equalTo } from 'firebase/database';
import { db } from './firebase';

const initialState = {
  emails: [],
  unreadCount: 0,
};

export const fetchEmails = createAsyncThunk('inbox/fetchEmails', async (userEmail, { rejectWithValue }) => {
  try {
    const emailsRef = ref(db, 'emails');
    const query = await get(ref(emailsRef, 'receiver', userEmail));

    if (query.exists()) {
      const emailData = query.val();
      const emails = Object.keys(emailData).map((key) => ({
        id: key,
        ...emailData[key],
      }));

      console.log('Fetched emails:', emails);
      return emails;
    }

    return [];
  } catch (error) {
    console.log('Fetch emails error:', error.message);
    return rejectWithValue(error.message);
  }
});

export const markAsRead = createAsyncThunk('inbox/markAsRead', async (emailId, { rejectWithValue }) => {
  try {
    await update(ref(db, `emails/${emailId}`), { read: true });

    console.log('Marked email as read:', emailId);
    return emailId;
  } catch (error) {
    console.log('Mark as read error:', error.message);
    return rejectWithValue(error.message);
  }
});

export const deleteEmail = createAsyncThunk('inbox/deleteEmail', async (emailId, { rejectWithValue }) => {
  try {
    await remove(ref(db, `emails/${emailId}`));

    console.log('Deleted email:', emailId);
    return emailId;
  } catch (error) {
    console.log('Delete email error:', error.message);
    return rejectWithValue(error.message);
  }
});

export const subscribeToEmails = (userEmail) => (dispatch) => {
  const emailsRef = ref(db, 'emails');
  const queryRef = query(emailsRef, orderByChild('receiver'), equalTo(userEmail));

  const handleSnapshot = (snapshot) => {
    if (snapshot.exists()) {
      const emailData = snapshot.val();
      const emails = Object.keys(emailData).map((key) => ({
        id: key,
        ...emailData[key],
      }));

      dispatch(fetchEmails.fulfilled(emails));
    } else {
      dispatch(fetchEmails.fulfilled([]));
    }
  };

  onValue(queryRef, handleSnapshot);

  return () => {
    off(queryRef, handleSnapshot);
  };
};

const inboxSlice = createSlice({
  name: 'inbox',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(markAsRead.fulfilled, (state, action) => {
        const emailIndex = state.emails.findIndex((email) => email.id === action.payload);
        if (emailIndex !== -1) {
          state.emails[emailIndex].read = true;
          state.unreadCount = state.emails.reduce((count, email) => count + (email.read ? 0 : 1), 0);
        }
      })
      .addCase(deleteEmail.fulfilled, (state, action) => {
        state.emails = state.emails.filter((email) => email.id !== action.payload);
        state.unreadCount = state.emails.reduce((count, email) => count + (email.read ? 0 : 1), 0);
      });
  },
});

export const selectEmails = (state) => state.inbox.emails;
export const selectUnreadCount = (state) => state.inbox.unreadCount;

export default inboxSlice.reducer;
