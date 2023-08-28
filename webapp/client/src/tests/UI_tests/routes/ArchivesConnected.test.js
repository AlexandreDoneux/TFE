import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import {beforeEach, afterEach} from "../testing_functions";
import axios from 'axios'; 
import { UserProvider, UserContext } from '../../../UserContext';
import Base from "../../../Base";



// Mock UserContext values
// jest.fn() can be checked on how many times it has been called.
const contextValue = {
  isConnected: true,
  setIsConnected: jest.fn(),
  removeIsConnected: jest.fn(),
};


// Mock axios module
jest.mock('axios');

describe('/monitoring/archived route connected', () => {
  it('checks the ArchivedList element is rendered as well as the MenuDrawer component.', async () => {


    // Mock axios.post for fetching archived monitoring IDs and data
    axios.post
      .mockResolvedValueOnce({ data: [
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
    ] })  // mock for /probe/get_active endpoint of MenuDrawer
      .mockResolvedValueOnce({ data: ["3", "4"] }) 
      .mockResolvedValueOnce({
        data: {
          "monitor_id": 3,
          "name": "aaa",
          "start_date": "2023-05-28T14:30:00.000Z",
          "end_date": null,
        },
      })
      .mockResolvedValueOnce({
        data: {
          "monitor_id": 4,
          "name": "bbb",
          "start_date": "2023-05-28T14:30:00.000Z",
          "end_date": null,
        },
      });


    const forced_route = "/monitoring/archived";

    render(
      <UserContext.Provider value={contextValue}>
        {/* Render the ArchivedList component */}
        <Base forced_route={forced_route}></Base>
      </UserContext.Provider>,
    );
    

    // Wait for data to load
    await waitFor(() => {
      // check the list with archived monitorings is rendered
      expect(screen.queryByText('Name')).toBeInTheDocument();
      expect(screen.queryByText('Start Date')).toBeInTheDocument();
      expect(screen.queryByText('End Date')).toBeInTheDocument();
      // Check the MenuDrawer component is present. To ceck for the inside of the drawer we need to click on it. We will do that in another test.
      expect(screen.queryByText('Disconnect')).toBeInTheDocument();
      expect(screen.queryByText('Menu')).toBeInTheDocument();

    });
  });
  
});
