import React, { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

const ArchivingPopup = ({ showPopup, onClose }) => {
  

  return (
    <div>
      <Dialog open={showPopup} onClose={onClose} >
        <DialogTitle>Archiving a monitoring</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to archive this monitoring ? <br/>This action cannot be reversed.</p>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary">
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