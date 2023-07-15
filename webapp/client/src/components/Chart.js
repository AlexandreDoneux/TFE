import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {ThemeProvider, createTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';
import { unstable_styleFunctionSx, styled } from '@mui/system';
import Button from '@mui/material/Button';

import theme from '../theme';


const Div = styled('div')(unstable_styleFunctionSx);
const H1 = styled('h1')(unstable_styleFunctionSx);



//axios.defaults.withCredentials = true


function transformTimestamps(arr) {
    return arr.map(obj => {
      const Timestamp = new Date(obj.Timestamp);
      const hours = Timestamp.getHours();
      const minutes = Timestamp.getMinutes();
      const seconds = Timestamp.getSeconds();
      const day = Timestamp.getDate();
      const month = Timestamp.getMonth() + 1; // Add 1 since getMonth() returns zero-based index
      const year = Timestamp.getFullYear();
  
      const formattedTimestamp = `${hours}h${minutes}  ${day}/${month.toString().padStart(2, '0')}/${year}`;
      return { ...obj, Timestamp: formattedTimestamp };
    });
  }


const Chart = () => {

    // defines empty data state (empty array) and setData method from useState()
    const [data, setData] = useState([]);

    let {monitor_id} = useParams();
    console.log(monitor_id)

    // useEffect -> determines action and when it should be executed
    // here : defines fetchData function and executes it when monitor_id prop changes
    useEffect(() => {
        const fetchData = async () => {
          // force connect to develop
          
          const connection = await axios.post(`http://www.alexandre.doneux.eu:3001/user/connect`, 
            { 
              "user_email":"john@doe.com",
              "password": "passjohn"
            },
            {
              withCredentials: true,
            }
          );
          console.log(document.cookie);
          console.log(connection);
          console.log(monitor_id)
          


          const result = await axios.post(`http://www.alexandre.doneux.eu:3001/data/get_monitoring`, 
            {
              "monitor_id" : monitor_id,
            },
            {
              withCredentials: true,
            }
            );
            console.log(result);
            setData(transformTimestamps(result.data[0]));
        };

        fetchData();
      }, [monitor_id]);

      return (
        <ThemeProvider theme={theme}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
            <H1 sx={{color:"#4E598C", ml:4}}>Temperature</H1>
              <Div width="90%" sx={{ bgcolor: "background.main", mb: 5, pt: 5 }}>
                <ResponsiveContainer width="100%" aspect={2} backgroundcolor="blue">
                  <LineChart width={1000} height={500} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} fill="background.main">
                    <XAxis dataKey="Timestamp" />
                    <YAxis />
                    <CartesianGrid stroke="#4E598C" strokeDasharray="9 9" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="TempValue" stroke='#4E598C'  strokeWidth={3} activeDot={{ r: 8 }} dot={false}/>
                  </LineChart>
                </ResponsiveContainer>
              </Div>
            </Grid>
            <Grid item xs={4} display="flex" justifyContent="flex-end" alignItems="flex-start" >
              <Button variant="contained" sx={{p:5, mt:10, mr:5}} color="error">Archive this monitoring</Button>
            </Grid>

            <Grid item xs={8}>
            <H1 sx={{color:"#4E598C", ml:4}}>Density</H1>
              <Div sx={{ bgcolor: "background.main", mb: 5, pt: 5 }}>
                <ResponsiveContainer width="100%" aspect={2}>
                  <LineChart width={1000} height={500} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} fill="background.main">
                    <XAxis dataKey="Timestamp" />
                    <YAxis />
                    <CartesianGrid stroke="#4E598C" strokeDasharray="9 9" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="FloatDensityValue" stroke='#9D8420' strokeWidth={3} activeDot={{ r: 8 }} dot={false}/>
                    <Line type="monotone" dataKey="RefractDensityValue" stroke='#B20D30' strokeWidth={3} activeDot={{ r: 8 }} dot={false}/>
                  </LineChart>
                </ResponsiveContainer>
              </Div>
            </Grid>
          </Grid>
        </ThemeProvider>
      );
};

export default Chart;
