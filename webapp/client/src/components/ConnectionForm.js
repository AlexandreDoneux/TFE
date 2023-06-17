import React, { useState, useContext } from 'react';
import { styled } from '@mui/system';
import { TextField, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

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

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('http://localhost:3001/user/connect', {
        user_email: userEmail,
        password: password,
      })
      .then((response) => {
        const message = response.data;

        if (message === 'Invalid user_email') {
          setErrorMessage('Invalid user');
        } else if (message === 'Invalid password') {
          setErrorMessage('Invalid password');
        } else if (message === 'New session. Cookie has been set') {
          // Redirect the user to "/" path and set isConnected state to true
          setIsConnected(true);
          console.log("after set : ", isConnected)
          //navigate('/');
          window.location = '/';
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  console.log(isConnected)

  if(isConnected){
    return(
      <div>Already connected</div>
    )
  }
  else{
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
        {errorMessage && <p>{errorMessage}</p>}
        <SubmitButton variant="contained" color="primary" type="submit">
          Connect
        </SubmitButton>
        {isConnected ? (
                <div>I am connected</div>
              ) : (
                <div>I am not connected</div>
              )}
      </FormContainer>
      
    );
  }
  
};

export default ConnectionForm;
