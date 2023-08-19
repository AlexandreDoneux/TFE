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
  const { isConnected } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await axios.post(`http://localhost:3001/monitoring/get_archived`, {
          // Nothing -> remove
          "test": "test"
        }, {
          withCredentials: true,
        });
        await console.log(response1)
        await console.log(response1.data)
        const archived_monitoring_ids = response1.data;

        const requests = archived_monitoring_ids.map(async (id) => {
          const response2 = await axios.post(`http://localhost:3001/monitoring/get_data`, {
            "monitor_id": id
          }, {
            withCredentials: true,
          });
          await console.log(response2)
          return response2.data;
        });

        const monitoringData = await Promise.all(requests);
        setData(monitoringData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (isConnected) {
      fetchData();
    }
  }, [isConnected]);

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





