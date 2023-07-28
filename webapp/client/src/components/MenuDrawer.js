import React, {useEffect, useState} from 'react';
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
import ProbeList from './ProbeList';

import axios from 'axios';

export default function TemporaryDrawer() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch archived monitoring IDs
    axios.post(`http://www.alexandre.doneux.eu:3001/probe/get_active`,
        { 
        // nothing -> remove
            "test" : "test"
        },
        {
            withCredentials: true,
        })
        .then((response) => {
            console.log(response)
            const probes_array = response.data;
            //console.log(probes_array)
            setData(probes_array);
            
        })
        .catch((error) => {
            console.error('Error:', error);
            setData(error.response.data);
        });
  }, []);

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
              <ListItemText primary={"Archive monitorings"} />
            </ListItemButton>
          </ListItem>
      </List>
      <Divider />
      <List>
        <ProbeList data={data}></ProbeList>
        <Divider />
        <ListItem key="probe_add" disablePadding>
            <ListItemButton onClick={() => (window.location = '/probe/add')}>
              <ListItemIcon>
                <AddCircleOutlineIcon/>
              </ListItemIcon>
              <ListItemText primary="Adding a probe" />
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