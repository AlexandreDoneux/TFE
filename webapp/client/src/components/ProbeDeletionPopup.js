import React, { useState } from "react";
import axios from 'axios';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

const ProbeDeletionPopup = (props) => {

  const {showPopup, onClose,  probe_id} = props;

  const DeleteProbe = async(probe_id)=>{
    const result = await axios.post(`http://localhost:3001/probe/delete`, 
      {
        "probe_id" : probe_id,
      },
      {
        withCredentials: true,
      }
    );
    window.location = await `/`;
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
      </Dialog>
    </div>
  );
};

export default ProbeDeletionPopup;