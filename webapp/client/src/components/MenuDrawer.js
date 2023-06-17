import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
//import InboxIcon from '@mui/icons-material/MoveToInbox';
//import MailIcon from '@mui/icons-material/Mail';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function TemporaryDrawer() {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
          <ListItem key="archives" disablePadding>
            <ListItemButton onClick={() => (window.location = '/monitoring/archived')}>
              <ListItemIcon>
                <InventoryIcon></InventoryIcon>
              </ListItemIcon>
              <ListItemText primary={"Suivis Archivés"} />
            </ListItemButton>
          </ListItem>
      </List>
      <Divider />
      <List>
        {['Probe 1', 'Probe 2', 'Probe 3'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => window.location = "/monitoring/1"}>
              <ListItemIcon>
                <DeviceThermostatIcon></DeviceThermostatIcon>
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider />
        <ListItem key="probe_add" disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <AddCircleOutlineIcon/>
              </ListItemIcon>
              <ListItemText primary="Ajout d'une sonde" />
            </ListItemButton>
          </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      {['left'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button variant="contained" onClick={toggleDrawer(anchor, true)} sx={{ml:2, mr:2, my:3, py:2, bgcolor:"secondary.two", fontSize:20, color: "primary.main", fontWeight: 'bold'}}>Menu</Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}