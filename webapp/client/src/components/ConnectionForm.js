import React, { useState, useContext } from 'react';
import { styled } from '@mui/system';
import { TextField, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

import { sha256HashPassword } from '../passwordUtils';

const FormContainer = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  maxWidth: 400,
  margin: 'auto',
  marginTop: '32px',
  padding: '24px',
  border: '1px solid #E0E0E0',
  borderRadius: '4px',
});

const SubmitButton = styled(Button)({
  marginTop: '16px',
});

const ConnectionForm = () => {
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const { isConnected, setIsConnected } = useContext(UserContext);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {

      console.log(password)
      const hashedPassword = sha256HashPassword(password,'9mtZy9IbOBNYz8x1FsHiHw==')
      console.log(hashedPassword)
      const response = await axios.post(`http://www.alexandre.doneux.eu:3001/user/connect`, 
        { 
          "user_email": userEmail,
          "password": hashedPassword
        },
        {
          withCredentials: true,
        }
      );

      const message = response.data;
      console.log(message)

      if (message === 'New session. Cookie has been set') {
        setIsConnected(true);
        navigate('/');
      }

      
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data;
        if (errorMessage === 'Invalid user_email') {
          setErrorMessage('Invalid user');
        } else if (errorMessage === 'Invalid password') {
          setErrorMessage('Invalid password');
        } else if (errorMessage === 'Invalid credentials') {
          setErrorMessage('Invalid email or password');
        }
      } else {
        console.error('Error:', error);
      }
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <TextField
        label="User Email"
        type="email"
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
        required
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <SubmitButton variant="contained" color="primary" type="submit">
        Connect
      </SubmitButton>
    </FormContainer>
  );
};

export default ConnectionForm;
