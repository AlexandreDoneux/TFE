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

describe('/probe/0/monitoring/1 route connected', () => {
  it('checks the MenuDrawer and the Chart component  are rendered.', async () => {


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
      .mockResolvedValueOnce({ data: [
        [
            {
                "DataId": 1,
                "TempValue": 25.5,
                "FloatDensityValue": 1.2,
                "RefractDensityValue": 3.4,
                "Timestamp": "2023-05-28T14:30:00.000Z",
                "MonitorId": 1
            },
            {
                "DataId": 2,
                "TempValue": 26,
                "FloatDensityValue": 1.3,
                "RefractDensityValue": 3.5,
                "Timestamp": "2023-05-28T15:00:00.000Z",
                "MonitorId": 1
            },
            {
                "DataId": 3,
                "TempValue": 26.3,
                "FloatDensityValue": 1.3,
                "RefractDensityValue": 3.5,
                "Timestamp": "2023-05-28T15:30:00.000Z",
                "MonitorId": 1
            },
            {
                "DataId": 4,
                "TempValue": 26.2,
                "FloatDensityValue": 1.3,
                "RefractDensityValue": 3.5,
                "Timestamp": "2023-05-28T16:00:00.000Z",
                "MonitorId": 1
            },
            {
                "DataId": 5,
                "TempValue": 25.3,
                "FloatDensityValue": 1.3,
                "RefractDensityValue": 3.5,
                "Timestamp": "2023-05-28T16:30:00.000Z",
                "MonitorId": 1
            },
            {
                "DataId": 6,
                "TempValue": 25,
                "FloatDensityValue": 1.3,
                "RefractDensityValue": 3.5,
                "Timestamp": "2023-05-28T17:00:00.000Z",
                "MonitorId": 1
            },
            {
                "DataId": 7,
                "TempValue": 25.4,
                "FloatDensityValue": 1.3,
                "RefractDensityValue": 3.5,
                "Timestamp": "2023-05-28T17:30:00.000Z",
                "MonitorId": 1
            },
            {
                "DataId": 8,
                "TempValue": 25.9,
                "FloatDensityValue": 1.3,
                "RefractDensityValue": 3.5,
                "Timestamp": "2023-05-28T18:00:00.000Z",
                "MonitorId": 1
            },
            {
                "DataId": 9,
                "TempValue": 26.4,
                "FloatDensityValue": 1.3,
                "RefractDensityValue": 3.5,
                "Timestamp": "2023-05-28T18:30:00.000Z",
                "MonitorId": 1
            },
            {
                "DataId": 10,
                "TempValue": 26.9,
                "FloatDensityValue": 1.3,
                "RefractDensityValue": 3.5,
                "Timestamp": "2023-05-28T19:00:00.000Z",
                "MonitorId": 1
            }
        ],
        {
            "affectedRows": 0,
            "insertId": "0",
            "warningStatus": 0
        }
    ] })


    /*
    // Mock ResizeObserver
    class MockResizeObserver {
        constructor(callback) {
        this.callback = callback;
        }
    
        observe() {}
    
        disconnect() {
        this.callback();
        }
    }
  
    // Assign the mock to window.ResizeObserver
    window.ResizeObserver = MockResizeObserver;
    */

    /*
    // mocking the ResizeObserver constructor used by ResponsiveContainer from recharts
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
      }));
    */


    const forced_route = "/probe/0/monitoring/1";

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
      expect(screen.queryByText('Temperature')).toBeInTheDocument();
      expect(screen.queryByText('Density')).toBeInTheDocument();
      expect(screen.queryByText('Menu')).toBeInTheDocument();

      expect(screen.queryByText('Archive this monitoring')).not.toBeInTheDocument();

      expect(screen.queryByText('The number of this probe is : 1')).not.toBeInTheDocument();

    });
  });

});