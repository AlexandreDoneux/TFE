import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ProbeData from './ProbeData';




const ProbeList = (props) => {
    const {data} = props;
    console.log(data)
    console.log(typeof(data))

    return (
        <div>
          {data === "no probes" ? (
            <ListItem key="noProbes" disablePadding>
              <ListItemButton onClick={() => window.location = `/no-probes`}>
                <ListItemIcon>
                  <ErrorOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="No probes available." />
              </ListItemButton>
            </ListItem>
          ) : data === "not connected (cookie)" || data === "not connected" ? (
            <ListItem key="notConnected" disablePadding>
              <ListItemButton onClick={() => window.location = `/connection`}>
                <ListItemIcon>
                  <ErrorOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="It seems you are not connected." />
              </ListItemButton>
            </ListItem>
          ) : data ? (
            data.map((probes) => (
              <ListItem key={probes.ProbeNames} disablePadding>
                <ListItemButton onClick={() => window.location = `/probe/${probes.ProbeIds}/monitoring/${probes.ActiveMonitoringId}`}>
                  <ListItemIcon>
                    <DeviceThermostatIcon />
                  </ListItemIcon>
                  <ListItemText primary={probes.ProbeNames} />
                </ListItemButton>
              </ListItem>
            ))
          ) : null}
        </div>
      );
      
}

export default ProbeList;



