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

describe('/connection route connected', () => {
  it('checks the ConnectionForm is rendered.', async () => {


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
      


    const forced_route = "/connection";

    render(
      <UserContext.Provider value={contextValue}>
        {/* Render the ArchivedList component */}
        <Base forced_route={forced_route}></Base>
      </UserContext.Provider>,
    );
    

    // Wait for data to load
    await waitFor(() => {
      // Check the MenuDrawer component is present. To check for the inside of the drawer we need to click on it. We will do that in another test.
      expect(screen.queryByText('Disconnect')).toBeInTheDocument(); // disconnect button 
      expect(screen.queryAllByText('Connect')).toHaveLength(1); // connect button from the connection form
      expect(screen.queryByText('Menu')).toBeInTheDocument();

    });
  });

});
