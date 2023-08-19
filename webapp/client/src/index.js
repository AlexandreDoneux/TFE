import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import Chart from './components/Chart';
import MenuDrawer from './components/MenuDrawer';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';

import {ThemeProvider, createTheme } from '@mui/material/styles';
import { unstable_styleFunctionSx, styled } from '@mui/system';

import theme from './theme';

import { UserProvider } from './UserContext';
import Base from './Base';

const Div = styled('div')(unstable_styleFunctionSx);


/*
const FullPageComponentWrapper = styled('div')(({ theme }) => ({
  flexGrow: 1,
  width: '100vw',
  height: '100vh',
  backgroundColor: theme.palette.secondary.two,
}));
*/


const element = (
  
  <ThemeProvider theme={theme} >
    <UserProvider>
      <Base></Base>
    </UserProvider>
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
