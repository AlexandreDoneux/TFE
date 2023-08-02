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

const CreateProbeForm = () => {

    const [probeName, setProbeName] = useState('');
    const [probePassword, setProbePassword] = useState('');
    const [probePasswordConfirmation, setProbePasswordConfirmation] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (probePassword === probePasswordConfirmation){
            // frontend hash
            //probePassword = probePassword;
            setProbePassword(probePassword);

            try {
                const response = await axios.post(`http://www.alexandre.doneux.eu:3001/probe/add`, 
                { 
                    "probe_frontend_hashed" : probePassword,
                    "probe_name" : probeName
                },
                {
                    withCredentials: true,
                }
                );
        
                const { message, probeId } = response.data;
                const probe_id = probeId;
        
                
                if (message === "Probe created successfully") {
                await alert("Probe created successfully")
                //console.log(probe_id, monitor_id)
                //send back new monitoring_id to redirect
                navigate(`/probe/${probe_id}/monitoring/0`);
                }
                
            } 
            catch (error) {
                if (error.response && error.response.status === 400) {
                    const errorMessage = error.response.data;
                    if (errorMessage === "User does not exist") {
                        // should be checked before beeing able to access the form
                        setErrorMessage("User does not exist");
                    } 
                    else if (errorMessage === "Probe name already exists for the user") {
                        setErrorMessage("You already have a probe with this name. Use another one.");
                    }
                    else if (errorMessage === "not connected (session)" || "not connected (cookie)") {
                        setErrorMessage('You are not connected !');
                    }
                } 
                else {
                    console.error('Error:', error);
                    setErrorMessage('An error occured. Contact the website administrator.');
                }
            }
        } 
        else {
            setErrorMessage("The password and password confirmation are not the same !");
        }
    };

    return (
        <Div >
            <h2>Create a new probe. Don't forget your password ! </h2>
            <FormContainer onSubmit={handleSubmit} sx={{my:8}}>
                <TextField
                    label="Probe name"
                    type="name"
                    value={probeName}
                    onChange={(e) => setProbeName(e.target.value)}
                    required
                />
                <TextField
                    label="Probe password"
                    type="password"
                    value={probePassword}
                    onChange={(e) => setProbePassword(e.target.value)}
                    required
                />
                <TextField
                    label="Confirm password"
                    type="password"
                    value={probePasswordConfirmation}
                    onChange={(e) => setProbePasswordConfirmation(e.target.value)}
                    required
                />
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <SubmitButton variant="contained" color="primary" type="submit">
                    Create probe
                </SubmitButton>
            </FormContainer>
        </Div>
    );
};

export default CreateProbeForm;
