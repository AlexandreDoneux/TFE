import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import Chart from './Chart';
import CreateMonitoringForm from './CreateMonitoringForm';

const ProbeData = () => {
  const { probe_id, monitor_id } = useParams();
  //console.log(monitor_id);
  console.log(typeof(probe_id))

  const is_archived = parseInt(probe_id) === 0 ? 1 : 0;  // putting isArchived in Chart component ?

  //console.log(probe_id)
  console.log("archived ? ", is_archived)


  return (
    <>
      {parseInt(monitor_id) ? (
        <Chart probe_id={probe_id} monitor_id={monitor_id} is_archived={is_archived}/>
      ) : (
        <CreateMonitoringForm probe_id={probe_id}></CreateMonitoringForm>
      )}
    </>
  );
};

export default ProbeData;
