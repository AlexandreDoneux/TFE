import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ProbeData from './ProbeData';




const ProbeList = ({data}) => {
    console.log(data)
    console.log(typeof(data))

    return(
        <div>
            {data ? (
                data.map((probes) => (
                    <ListItem key={probes.ProbeNames} disablePadding>
    
                        <ListItemButton onClick={() => window.location = `/probe/${probes.ProbeIds}/monitoring/${probes.ActiveMonitoringId}`}>
                            <ListItemIcon>
                            <DeviceThermostatIcon></DeviceThermostatIcon>
                            </ListItemIcon>
                            <ListItemText primary={probes.ProbeNames} />
                        </ListItemButton>
                        
                    </ListItem>
                ))
            ) : (
                <ListItem key="connectionError" disablePadding>
                    <ListItemButton onClick={() => window.location = `/connection`}>
                        <ListItemIcon>
                            <ErrorOutlineIcon></ErrorOutlineIcon>
                        </ListItemIcon>
                        <ListItemText primary="It seems you are not connected" />
                    </ListItemButton>
                    
                </ListItem>
            )

            }
            
        </div>
        
    );
}

export default ProbeList;



