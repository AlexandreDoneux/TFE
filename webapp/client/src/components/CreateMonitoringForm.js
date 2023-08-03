import React, { useState, useContext } from 'react';
import { styled } from '@mui/system';
import { TextField, Button, Alert } from '@mui/material';
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

  //const { isConnected, setIsConnected } = useContext(UserContext);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`https://www.alexandre.doneux.eu:8443/monitoring/add`, 
        { 
          "monitor_name": monitorName,
          "probe_id": probe_id
        },
        {
          withCredentials: true,
        }
      );

      const { message, monitoringId } = response.data;
      const monitor_id = monitoringId;

      
      if (message === 'Monitoring created successfully') {
        //await alert("Monitoring created successfully")
        console.log(probe_id, monitor_id)
        //send back new monitoring_id to redirect
        navigate(`/probe/${probe_id}/monitoring/${monitor_id}`);
      }
      
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data;
        if (errorMessage === 'Probe does not belong to the user') {
            // should be checked before beeing able to access the form
          setErrorMessage('You are trying to create a monitoring on a probe that is not yours !');
        } else if (errorMessage === 'Monitoring already exists for the probe') {
          setErrorMessage('A monitoring already exists for the probe');
        }
        else if (errorMessage === "not connected (session)" || "not connected (cookie)") {
            setErrorMessage('You are not connected !');
          }
      } else {
        console.error('Error:', error);
        setErrorMessage('An error occured. Contact the website administrator.');
      }
      
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
