import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

/*
const data = [
  { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Jul', uv: 3490, pv: 4300, amt: 2100 },
];
*/

const Chart = (monitor_id) => {

    // defines empty data state (empty array) and setData method from useState()
    const [data, setData] = useState([]);

    

    // useEffect -> determines action and when it should be executed
    // here : defines fetchData function and executes it when monitor_id prop changes
    useEffect(() => {
        const fetchData = async () => {
            console.log(monitor_id)
            console.log(JSON.stringify( monitor_id ))
            //const result = await axios(`http://mariadb:3001/monitoring_data`,
            const result = await axios.post(`http://192.168.0.188:3001/monitoring_data`, 
            monitor_id
            );
            console.log(result)
            setData(result.data[0]);
        };

        fetchData();
        console.log(data)
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
