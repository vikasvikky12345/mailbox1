import React from 'react';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Login from './components/Login';
import Welcome from './components/Welcome';
import Navbar from './components/Navbar';
import Sent from './components/Sent';
import InboxEmailDetails from './components/InboxEmaildetails';
import SentDetails from './components/SentDetails';
import Inbox from './components/inbox';
import SignUp from './components/Signup';

const App = () => {
  return (
    <>
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path='/' element = {<SignUp/>}/>
          <Route path = '/login' element = {<Login/>}/>
          <Route path = '/welcome' element={<Welcome/>}/>
          <Route path = 'signup' element={<SignUp/>}/>
          <Route path="/inbox" element={<Inbox/>} />
          <Route path="/sent" element={<Sent/>} />
          <Route path="/inbox/:emailId" element={<InboxEmailDetails/>} />
          <Route path="/sent/:emailId" element={<SentDetails/>} />
        </Routes>
      </BrowserRouter>

    </>
  );
};

export default App;
