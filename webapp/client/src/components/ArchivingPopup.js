import React, { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

const ArchivingPopup = () => {
  const [open, setOpen] = useState(true);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Archiving a monitoring</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to archive this monitoring ? <br/>This action cannot be reversed.</p>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} color="primary">
            Yes
          </Button>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ArchivingPopup;