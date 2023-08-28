import React, { useState, useContext } from 'react';
import { styled } from '@mui/system';
import { Box, AppBar, Button } from '@mui/material';
import { BrowserRouter as Router, MemoryRouter, Routes, Route } from 'react-router-dom';
import ConnectionForm from './components/ConnectionForm';
import { UserContext } from './UserContext';
import ConnectDisconnectButton from './components/ConnectDisconnectButton';
import Chart from './components/Chart';
import MenuDrawer from  './components/MenuDrawer';
import ArchivedList from './components/ArchivedList';
import ProbeData from './components/ProbeData';
import CreateProbeForm from './components/CreateProbeForm';

import {ThemeProvider, createTheme } from '@mui/material/styles';
import theme from './theme';

//const { isConnected, setIsConnected } = useContext(UserContext);

/*
const FullPageComponentWrapper = styled('div')(({ theme }) => ({
  flexGrow: 1,
  width: '100vw',
  height: '100vh',
  backgroundColor: theme.palette.secondary.two,
}));
*/

const Div = styled('div')({
  // Add your custom styles here
});



const Base = (props) => {
  const { isConnected, setIsConnected } = useContext(UserContext);


  const FullPageComponentWrapper = styled('div')(({ theme }) => ({
    flexGrow: 1,
    width: '100vw',
    height: '100vh',
    backgroundColor: theme.palette.secondary.two,
  }));

  // if a forced_route was given to the Base component (ex: testing) it will be forced to render the element related to that route
  const RouterWrapper = props.forced_route ? (
    <MemoryRouter initialEntries={[props.forced_route]}>
      <Routes >
      {isConnected ? (
                  <Route path="/" element={<div>I am connected</div>} />
                ) : (
                  <Route path="/" element={<div>I am not connected ---</div>} />
                )}
                <Route path="/connection" element={<ConnectionForm></ConnectionForm>} />

                <Route path="/probe/:probe_id/monitoring/:monitor_id" element={<ProbeData/>} />

                <Route path="/monitoring/archived" element={<ArchivedList></ArchivedList>} />
                <Route path="/monitoring/create" element={<div>This is monitoring creation</div>} />
                <Route path="/probe/add" element={<CreateProbeForm/>} />
      </Routes>
    </MemoryRouter>
  ) : (
    <Router>
      <Routes>
      {isConnected ? (
                  <Route path="/" element={<div>I am connected</div>} />
                ) : (
                  <Route path="/" element={<div>I am not connected ---</div>} />
                )}
                <Route path="/connection" element={<ConnectionForm></ConnectionForm>} />

                <Route path="/probe/:probe_id/monitoring/:monitor_id" element={<ProbeData/>} />

                <Route path="/monitoring/archived" element={<ArchivedList></ArchivedList>} />
                <Route path="/monitoring/create" element={<div>This is monitoring creation</div>} /> {/* THIS /monitorring/create ROUTE NEEDS TO BE DELETED. NOT USED ANYMORE*/}
                <Route path="/probe/add" element={<CreateProbeForm/>} />
      </Routes>
    </Router>
  );


  return (
    <ThemeProvider theme={theme} >
      <FullPageComponentWrapper>
        <Box width="auto" height="auto" backgroundColor="secondary.two">
          <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
            <Box width="auto" height="auto" sx={{ display: 'flex' }}>
              <Div sx={{ ml: 3, mr: 3, display: 'flex' }}>
              {isConnected ? (
                  <MenuDrawer></MenuDrawer>
                ) : (
                  <div></div>
                )}
              </Div>

              <Div sx={{ ml: 10, color: 'secondary.two', fontSize: 30 }}>
                <h1>Beer Logger</h1>
              </Div>
              <Div sx={{ ml: 'auto', mr: 3, display: 'flex' }}>
                <ConnectDisconnectButton></ConnectDisconnectButton>
              </Div>
            </Box>
          </AppBar>

          <Div id="main" sx={{ mx: 4, my: 4 }} width="auto" height="auto">
            {RouterWrapper}
          </Div>
        </Box>
      </FullPageComponentWrapper>
    </ThemeProvider>
    
  );
};

export default Base;
