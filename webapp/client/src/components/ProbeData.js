import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Assuming you are using react-router-dom
import Chart from './Chart';

const ProbeData = () => {
  const { probe_id, monitor_id } = useParams();
  console.log(monitor_id);

  return (
    <>
      {parseInt(monitor_id) ? (
        <Chart probe_id={probe_id} monitor_id={monitor_id} />
      ) : (
        <div>This probe has no active monitoring</div>
      )}
    </>
  );
};

export default ProbeData;
