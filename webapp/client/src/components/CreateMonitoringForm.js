import React, { useState, useContext } from 'react';
import { styled } from '@mui/system';
import { TextField, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { unstable_styleFunctionSx} from '@mui/system';


const Div = styled('div')(unstable_styleFunctionSx);
const H2 = styled('h2')(unstable_styleFunctionSx);

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

const CreateMonitoringForm = (props) => {
  const {probe_id} = props

  const [monitorName, setMonitorName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const { isConnected, setIsConnected } = useContext(UserContext);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`http://localhost:3001/monitoring/add`, 
        { 
          "monitor_name": monitorName,
          "probe_id": probe_id
        },
        {
          withCredentials: true,
        }
      );

      const message = response.data;
      console.log(message)

      /*
      if (message === 'New session. Cookie has been set') {
        setIsConnected(true);
        navigate('/');
      }
      */

      
    } catch (error) {
        /*
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
      */
     console.log(error)
    }
  };

  return (
    <Div >
        <h2>There is no active monitoring on this probe. Create one : </h2>
        <FormContainer onSubmit={handleSubmit} sx={{my:8}}>
            <TextField
                label="Monitoring name"
                type="name"
                value={monitorName}
                onChange={(e) => setMonitorName(e.target.value)}
                required
            />
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <SubmitButton variant="contained" color="primary" type="submit">
                Create monitoring
            </SubmitButton>
        </FormContainer>
    </Div>
    
  );
};

export default CreateMonitoringForm;
