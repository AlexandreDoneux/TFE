import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import {beforeEach, afterEach} from "../../testing_functions";
import axios from 'axios'; 
import { UserProvider, UserContext } from '../../../../UserContext';
import Base from "../../../../Base";



// Mock UserContext values
// jest.fn() can be checked on how many times it has been called.
const contextValue = {
  isConnected: true,
  setIsConnected: jest.fn(),
  removeIsConnected: jest.fn(),
};


// Mock axios module
jest.mock('axios');

describe('/probe/1/monitoring/0 route connected', () => {
  it('checks the monitoring creation form and probe deletion button are rendered.', async () => {


    // Mock axios.post for fetching archived monitoring IDs and data
    axios.post
      .mockResolvedValueOnce({ data: [ // mock for /probe/get_active endpoint of MenuDrawer
        {
            "Response": "user exists",
            "ProbeIds": "1",
            "ProbeNames": "Toto",
            "ActiveMonitoringId": 1
        },
        {
            "Response": "user exists",
            "ProbeIds": "2",
            "ProbeNames": "Tata",
            "ActiveMonitoringId": 0
        }
      ] })  // mock for /data/get_monitoring endpoint of Chart
     



    const forced_route = "/probe/1/monitoring/0";

    render(
      <UserContext.Provider value={contextValue}>
        {/* Render the ArchivedList component */}
        <Base forced_route={forced_route}></Base>
      </UserContext.Provider>,
    );
    

    // Wait for data to load
    await waitFor(() => {
      // Check the MenuDrawer component is present. To ceck for the inside of the drawer we need to click on it. We will do that in another test.
      expect(screen.queryByText('Disconnect')).toBeInTheDocument();
      expect(screen.queryByText('Menu')).toBeInTheDocument();

      expect(screen.queryByText('Monitoring name')).toBeInTheDocument();
      expect(screen.queryByText('Create monitoring')).toBeInTheDocument();

      expect(screen.queryByText('Delete this probe')).toBeInTheDocument();

    });
  });

});