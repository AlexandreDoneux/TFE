import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {ThemeProvider, createTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';
import { unstable_styleFunctionSx, styled } from '@mui/system';
import Button from '@mui/material/Button';

import theme from '../theme';
import ArchivingPopup from "./ArchivingPopup";


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
      
      const formatedTempValue = parseFloat(obj.TempValue.toFixed(1));
      const formatedFloatDensityValue = parseFloat(obj.FloatDensityValue.toFixed(3));
      const formatedRefractDensityValue = parseFloat(obj.RefractDensityValue.toFixed(3));
      return { ...obj, Timestamp: formattedTimestamp, TempValue: formatedTempValue, FloatDensityValue: formatedFloatDensityValue, RefractDensityValue: formatedRefractDensityValue };
    });
  }


const Chart = (props) => {

    // defines empty data state (empty array) and setData method from useState()
    const [data, setData] = useState([]);
    const [showPopup, setShowPopup] =useState(false);

    const handleTogglePopup = () => {
      setShowPopup((prevShowPopup) => !prevShowPopup);
    };

    //let {monitor_id} = useParams();
    const {probe_id, monitor_id, is_archived} = props
    console.log(probe_id, monitor_id, is_archived)
    console.log(typeof(probe_id))
    console.log(typeof(monitor_id))

    // useEffect -> determines action and when it should be executed
    // here : defines fetchData function and executes it when monitor_id prop changes
    useEffect(() => {
        const fetchData = async () => {
          
          const result = await axios.post(`http://localhost:3001/data/get_monitoring`, 
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
            {parseInt(is_archived) ? (
                <></>
              ) : (
                <Div sx={{mx:5}}>
                  <Button variant="contained" sx={{p:5, mt:10}} color="error" onClick={handleTogglePopup} >Archive this monitoring</Button>

                  {showPopup && <ArchivingPopup showPopup={showPopup} onClose={handleTogglePopup} monitor_id={monitor_id} probe_id={probe_id}/>}

                  <p><b>The number of this probe is : {probe_id} </b> <br></br>Put it in your probe configuration for it to correctly register data on the web app.</p>
                  <p>You also need to give your probe the password you chose at it's creation.</p>
                </Div>
            )}
              
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
