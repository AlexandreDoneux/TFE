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

describe('/probe/add route not connected', () => {
  it('checks the MenuDrawer component is not rendered, connect button and probe creation form is rendered.', async () => {


    const forced_route = "/probe/add";

    render(
      <UserContext.Provider value={contextValue}>
        {/* Render the ArchivedList component */}
        <Base forced_route={forced_route}></Base>
      </UserContext.Provider>,
    );
    

    // Wait for data to load
    await waitFor(() => {
      // Check the MenuDrawer component is present. To ceck for the inside of the drawer we need to click on it. We will do that in another test.
      expect(screen.queryByText('Connect')).toBeInTheDocument();
      expect(screen.queryByText('Probe name')).toBeInTheDocument();
      expect(screen.queryByText('Probe password')).toBeInTheDocument();
      expect(screen.queryByText('Confirm password')).toBeInTheDocument();
      expect(screen.queryByText('Create probe')).toBeInTheDocument();
      expect(screen.queryByText('Menu')).not.toBeInTheDocument();

    });
  });

});