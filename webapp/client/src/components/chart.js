import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import React, { useState, useEffect } from 'react';


function transformTimestamps(arr) {
    return arr.map(obj => {
      const Timestamp = new Date(obj.Timestamp);
      const hours = Timestamp.getHours();
      const minutes = Timestamp.getMinutes();
      const seconds = Timestamp.getSeconds();
      const day = Timestamp.getDate();
      const month = Timestamp.getMonth() + 1; // Add 1 since getMonth() returns zero-based index
      const year = Timestamp.getFullYear();
  
      const formattedTimestamp = `${hours}h${minutes} ${day}/${month.toString().padStart(2, '0')}/${year}`;
      return { ...obj, Timestamp: formattedTimestamp };
    });
  }


const Chart = (monitor_id) => {

    // defines empty data state (empty array) and setData method from useState()
    const [data, setData] = useState([]);

    

    // useEffect -> determines action and when it should be executed
    // here : defines fetchData function and executes it when monitor_id prop changes
    useEffect(() => {
        const fetchData = async () => {
            //const result = await axios(`http://mariadb:3001/monitoring_data`,
            const result = await axios.post(`http://192.168.0.188:3001/monitoring_data`, 
            monitor_id
            );
            setData(transformTimestamps(result.data[0]));
        };

        fetchData();
      }, [monitor_id]);

  return (
    <LineChart width={500} height={300} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <XAxis dataKey="Timestamp" />
      <YAxis />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="TempValue" stroke="#8884d8" activeDot={{ r: 8 }} />
      
    </LineChart>
  );
};

export default Chart;
