import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { signup, clearError,signupFailure } from '../authSlice';
import {Link} from 'react-router-dom'
import './SignUp.css';

const SignUp = () => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      dispatch(clearError());
      dispatch(signupFailure('Please fill in all fields.'));
      return;
    }

    if (password !== confirmPassword) {
      dispatch(clearError());
      dispatch(signupFailure('Passwords do not match.'));
      return;
    }

    dispatch(signup({ email:email, password:password }));
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSignup}>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Sign Up
        </Button>
      </Form>
      <p>
        Already a User? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};
export default SignUp;
