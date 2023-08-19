import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
//import ArchivedList from '../../components/ArchivedList';
import {beforeEach, afterEach} from "./testing_functions";
import axios from 'axios'; 
import { UserProvider, UserContext } from '../../UserContext';
import Base from "../../Base";

//
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { useHistory } from "react-router-dom";
import { useNavigate } from "react-router-dom";



import { unmountComponentAtNode } from "react-dom";




// Mock UserContext values
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

import ArchivedList from '../../components/ArchivedList';

describe('ArchivedList', () => {
  it('displays connected user data', async () => {

    // Mock axios.post for fetching archived monitoring IDs
    axios.post.mockResolvedValueOnce( 
      {data : ["3","4"]}
    );
    

    axios.post.mockResolvedValueOnce(
      {data :
        {
          "monitor_id": 3,
          "name": "aaa",
          "start_date": "2023-05-28T14:30:00.000Z",
          "end_date": null
        }
      }
    );
    axios.post.mockResolvedValueOnce(
      {data :
        {
          "monitor_id": 4,
          "name": "bbb",
          "start_date": "2023-05-28T14:30:00.000Z",
          "end_date": null
        }
      }
    );

    // Have to put base because could not render ArchivedList without being in a BrowserRouter tag. It is because ArchivedList uses <Link> that has to be inside a BrowserRouter or MemoryRouter.
    // Using MemoryRouter/BrowserRouter to indicate the route we are does not work because we can not have a Router inside a Router.
    //
    // Defining a history withe createMemoryHistory with the route, modifying Base component so he can use a history value in the Router props

    //const history = createMemoryHistory({ initialEntries: ['/monitoring/archived'] });
    //let history = useHistory();
    //history.push("/monitoring/archived");
    //const navigate = useNavigate();
    //navigate("/session-timed-out");

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
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Start Date')).toBeInTheDocument();
      expect(screen.getByText('End Date')).toBeInTheDocument();
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
