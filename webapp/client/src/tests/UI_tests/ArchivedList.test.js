import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import {beforeEach, afterEach} from "./testing_functions"; // testing functions not used directly in code. Still effective ?
import axios from 'axios'; 
import { UserProvider, UserContext } from '../../UserContext';
import Base from "../../Base";




// Mock UserContext values
// jest.fn() can be checked on how many times it has been called.
const contextValue = {
  isConnected: true,
  setIsConnected: jest.fn(),
  removeIsConnected: jest.fn(),
};

// use for react testing where url parameters are important
/*
// Mock useParams hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    probe_id: 1,
  }),
}));
*/


// Mock axios module
jest.mock('axios');

describe('ArchivedList', () => {
  it('displays connected user data', async () => {


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

    // Have to put base because could not render ArchivedList without being in a BrowserRouter tag. It is because ArchivedList uses <Link> that has to be inside a BrowserRouter or MemoryRouter.
    // Using MemoryRouter/BrowserRouter to indicate the route we are does not work because we can not have a Router inside a Router.
    //
    // Defining a history withe createMemoryHistory with the route, modifying Base component so he can use a history value in the Router props -> not working eather


    const forced_route = "/monitoring/archived";

    render(
      <UserContext.Provider value={contextValue}>
        {/* Render the ArchivedList component */}
        <Base forced_route={forced_route}></Base>
      </UserContext.Provider>,
    );
    

    // Wait for data to load
    await waitFor(() => {
      // Test assertions for rendered data
      // For example, check if table cells are present
      expect(screen.queryByText('Name')).toBeInTheDocument();
      expect(screen.queryByText('Start Date')).toBeInTheDocument();
      expect(screen.queryByText('End Date')).toBeInTheDocument();
    });
  });

 /* 
  it('displays message for disconnected user', () => {
    // Mock UserContext to simulate disconnected user
    // Render the component
    render(
      <UserContext.Provider value={contextValue}>
        <ArchivedList />
      </UserContext.Provider>
    );
    
    // Test assertions for the disconnected user message
    expect(screen.getByText('You need to be connected to access this page')).toBeInTheDocument();
  });
*/
  // Add more test cases as needed
});
