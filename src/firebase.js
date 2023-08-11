import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDUefUdSrgwZdyQSBZreFnbIiaZ1Z5wOiE",
  authDomain: "mailbox-c9780.firebaseapp.com",
  projectId: "mailbox-c9780",
  storageBucket: "mailbox-c9780.appspot.com",
  messagingSenderId: "580542228077",
  appId: "1:580542228077:web:008310bcea24139afc4164"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
export {auth,app,db}