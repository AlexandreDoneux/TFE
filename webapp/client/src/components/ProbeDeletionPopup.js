import React, { useState } from "react";
import axios from 'axios';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

const ProbeDeletionPopup = (props) => {

  const {showPopup, onClose,  probe_id} = props;
  const [errorMessage, setErrorMessage] = useState('');

  const DeleteProbe = async(probe_id)=>{
    try{
      const result = await axios.post(`https://www.alexandre.doneux.eu:8443/probe/delete`, 
      {
        "probe_id" : probe_id
      },
      {
        withCredentials: true,
      }
    );
    //await console.log(result)
    window.location = await '/';
    //await alert("probe deleted")
    }
    catch(error){ 
        console.log(error)
        if (error.response && error.response.status === 400) { // if code error 400
            const errorMessage = error.response.data;
            if (errorMessage === "Probe does not belong to the user") {
                // should be checked before beeing able to access the form
                setErrorMessage("Probe does not belong to the user");
            } 
            else if (errorMessage === "Active monitoring on the probe. Cannot delete probe") {
                setErrorMessage("Active monitoring on the probe. Cannot delete probe");
            }
            else if ((errorMessage === "not connected (session)") || (errorMessage === "not connected (cookie)")) {
                setErrorMessage("You are not connected !");
                //console.log("You are not connected !");
                await alert("You are not connected !");
                window.location = await `/connect`;
            }
        }
        else {
            console.error('Error:', error);
            setErrorMessage('An error occured. Contact the website administrator.');
        }
    }
    
  }

  const handleArchiveClick = (probe_id) => {
    onClose();
    DeleteProbe(probe_id);
  };
  

  return (
    <div>
      <Dialog open={showPopup} onClose={onClose} >
        <DialogTitle>Deleting a Probe</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this probe ? <br/>This action cannot be reversed.</p>
        </DialogContent>
        <DialogActions>
            <Button onClick={()=>{handleArchiveClick(probe_id)}} color="primary">
            Yes
          </Button>
          <Button onClick={onClose} color="error">
            Cancel
          </Button>
        </DialogActions>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </Dialog>
    </div>
  );
};

export default ProbeDeletionPopup;