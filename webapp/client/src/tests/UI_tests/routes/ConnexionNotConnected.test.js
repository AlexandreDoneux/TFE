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
  isConnected: false,
  setIsConnected: jest.fn(),
  removeIsConnected: jest.fn(),
};


// Mock axios module
jest.mock('axios');

describe('/connection route not connected', () => {
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
      // Check the connect button in the appbar and the connect button in the ConnectionForm are present
      expect(screen.queryAllByText('Connect')).toHaveLength(2);
      expect(screen.queryByText('Menu')).not.toBeInTheDocument();

    });
  });

});
