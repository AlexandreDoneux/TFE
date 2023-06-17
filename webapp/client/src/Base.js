import React, { useState, useContext } from 'react';
import { styled } from '@mui/system';
import { Box, AppBar, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ConnectionForm from './components/ConnectionForm';
import { UserContext } from './UserContext';

//const { isConnected, setIsConnected } = useContext(UserContext);

const FullPageComponentWrapper = styled('div')(({ theme }) => ({
  flexGrow: 1,
  width: '100vw',
  height: '100vh',
  backgroundColor: theme.palette.secondary.two,
}));

const Div = styled('div')({
  // Add your custom styles here
});

const MenuDrawer = () => {
  // Add your MenuDrawer component code here
  return <div>Menu Drawer</div>;
};

const Chart = () => {
  // Add your Chart component code here
  return <div>Chart</div>;
};

const Base = () => {
  const { isConnected, setIsConnected } = useContext(UserContext);

  return (
    <FullPageComponentWrapper>
      <Box width="auto" height="auto" backgroundColor="secondary.two">
        <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
          <Box width="auto" height="auto" sx={{ display: 'flex' }}>
            <Div sx={{ ml: 3, mr: 3, display: 'flex' }}>
              <MenuDrawer />
            </Div>

            <Div sx={{ ml: 10, color: 'secondary.two', fontSize: 30 }}>
              <h1>Beer Logger</h1>
            </Div>
            <Div sx={{ ml: 'auto', mr: 3, display: 'flex' }}>
              <Button
                variant="contained"
                sx={{
                  ml: 2,
                  mr: 2,
                  my: 3,
                  py: 2,
                  bgcolor: 'secondary.two',
                  fontSize: 20,
                  color: 'primary.main',
                  fontWeight: 'bold',
                }}
                onClick={() => (window.location = '/connection')}
              >
                Connexion
              </Button>
            </Div>
          </Box>
        </AppBar>

        <Div id="main" sx={{ mx: 4, my: 4 }} width="auto" height="auto">
          <Router>
            <Routes>
              {isConnected ? (
                <Route path="/" element={<div>I am connected</div>} />
              ) : (
                <Route path="/" element={<div>I am not connected</div>} />
              )}
              <Route path="/connection" element={<ConnectionForm></ConnectionForm>} />
              <Route path="/monitoring/:monitor_id" element={<Chart />} />
              <Route path="/monitoring/create" element={<div>This is monitoring creation</div>} />
              <Route path="/probe/add" element={<div>This is probe add</div>} />
            </Routes>
          </Router>
        </Div>
      </Box>
    </FullPageComponentWrapper>
  );
};

export default Base;
