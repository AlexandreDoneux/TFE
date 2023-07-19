import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import ProbeData from './ProbeData';




const ProbeList = ({data}) => {

    return(
        <div>
            {data.map((probes) => (
                <ListItem key={probes.ProbeNames} disablePadding>

                    <ListItemButton onClick={() => window.location = `/probe/${probes.ProbeIds}/monitoring/${probes.ActiveMonitoringId}`}>
                        <ListItemIcon>
                        <DeviceThermostatIcon></DeviceThermostatIcon>
                        </ListItemIcon>
                        <ListItemText primary={probes.ProbeNames} />
                    </ListItemButton>
                    
                </ListItem>
            ))}
        </div>
        
    );
}

export default ProbeList;



