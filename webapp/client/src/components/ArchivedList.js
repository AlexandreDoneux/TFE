import React, { useEffect, useState, useContext } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../UserContext';

const ArchivedListInside = ({ data }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.monitor_id} component={Link} to={`/probe/0/monitoring/${row.monitor_id}`}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.start_date}</TableCell>
              <TableCell>{row.end_date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const ArchivedList = () => {
  const [data, setData] = useState([]);
  const { isConnected, setIsConnected, removeIsConnected } = useContext(UserContext);

  useEffect(() => {
    // Fetch archived monitoring IDs
    axios.post(`http://www.alexandre.doneux.eu:3001/monitoring/get_archived`,
        { 
        // nothing -> remove
            "test" : "test"
        },
        {
            withCredentials: true,
        })
        .then((response) => {
            const archived_monitoring_ids = response.data;
            // Fetch data for each archived monitoring
            console.log(response.data)
            console.log(response)
            const requests = archived_monitoring_ids.map((id) => axios.post(`http://www.alexandre.doneux.eu:3001/monitoring/get_data`,
                { 
                    "monitor_id" : id
                },
                {
                    withCredentials: true,
                }
            ));
            // Execute all requests concurrently
            axios.all(requests)
            .then((responses) => {
                const monitoringData = responses.map((response) => response.data);
                console.log(monitoringData)
                setData(monitoringData);

            })
            .catch((error) => {
                console.error('Error:', error);
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }, []);

  return (
    <div>
      {isConnected ? (
        <ArchivedListInside data={data} />
      ) : (
        <h1>You need to be connected to access this page</h1>
      )}
    </div>
  );
};

export default ArchivedList;
