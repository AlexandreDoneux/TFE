import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chart from './components/chart';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';

import {ThemeProvider, createTheme } from '@mui/material/styles';
import { unstable_styleFunctionSx, styled } from '@mui/system';

import theme from './theme';

const Div = styled('div')(unstable_styleFunctionSx);



const FullPageComponentWrapper = styled('div')(({ theme }) => ({
  flexGrow: 1,
  width: '100vw',
  height: '100vh',
  backgroundColor: theme.palette.secondary.two,
}));



const element = (
  
  <ThemeProvider theme={theme} >
    <FullPageComponentWrapper>
      <Box width="auto" height="auto" backgroundColor="secondary.two" >
        <AppBar position="static" sx={{bgcolor: "primary.main"}}> 
          <Box width="auto" height="auto"  sx={{ display: 'flex' }}>
            
            <Div  sx={{m:"auto", color:"secondary.two", fontSize:30}}>
              <h1 >Alexandre Doneux</h1>
            </Div>
            <Div sx={{ml:"auto", mr:3, display: 'flex'}}>
              {/**
               * <ListingCours sx={{ml:3, mr:4, my:2, py:2, bgcolor:"secondary.button", fontSize:12}}/>
               * <MonCompteMenu sx={{ml:3, mr:4, my:2, py:2, bgcolor:"secondary.button", fontSize:12}}></MonCompteMenu>
               * 
               */}
              
              <Button variant="contained" sx={{ml:2, mr:2, my:3, py:2, bgcolor:"secondary.two", fontSize:20, color: "primary.main", fontWeight: 'bold'}} onClick={() => window.location = "/connection"}>Connexion</Button>
              
            </Div>
            
          </Box>
        </AppBar>
      
      
        <Div id="main" sx={{mx:4, my:4}}>
          <Router>
              <Routes>
                  <Route path="/" element={<div>this is home</div>}> </Route>
                  <Route path="/connection" element={<Div>this is connection</Div>}> </Route>
                  <Route path="/monitoring/:monitoring_id" element={<Chart></Chart>}> </Route>
                  <Route path="/monitoring/create" element={<div>this is monitoring creation</div>}> </Route>
                  <Route path="/probe/add" element={<div>this is probe add</div>}> </Route>
              </Routes>
          </Router>
        </Div>
      </Box>
    </FullPageComponentWrapper>
    
  </ThemeProvider>
);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    element
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
