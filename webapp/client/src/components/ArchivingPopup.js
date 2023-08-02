import React, { useState } from "react";
import axios from 'axios';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

const ArchivingPopup = (props) => {

  const {showPopup, onClose, monitor_id, probe_id} = props;

  const ArchiveMonitoring = async(monitoring_id)=>{
    //alert(`archiving monitoring ${monitoring_id}`)
    const result = await axios.post(`http://www.alexandre.doneux.eu:3001/monitoring/archive`, 
      {
        "monitor_id" : monitor_id,
      },
      {
        withCredentials: true,
      }
    );
    //await alert(`Monitoring ${monitoring_id} has been archived`);
    window.location = await `/probe/${probe_id}/monitoring/0`;
  }

  const handleArchiveClick = (monitoring_id) => {
    onClose();
    ArchiveMonitoring(monitoring_id); // Replace 1 with the actual Monitor ID you want to archive
  };
  

  return (
    <div>
      <Dialog open={showPopup} onClose={onClose} >
        <DialogTitle>Archiving a monitoring</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to archive this monitoring ? <br/>This action cannot be reversed.</p>
        </DialogContent>
        <DialogActions>
            <Button onClick={()=>{handleArchiveClick(monitor_id)}} color="primary">
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

export default ArchivingPopup;