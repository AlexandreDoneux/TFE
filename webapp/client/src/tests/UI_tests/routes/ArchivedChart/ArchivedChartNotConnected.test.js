import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import {beforeEach, afterEach} from "../../testing_functions";
import axios from 'axios'; 
import { UserProvider, UserContext } from '../../../../UserContext';
import Base from "../../../../Base";


////////////////  NEEDS TO BE REWRITTEN AFTER ERROR HANDLING WHEN USER NOT CONNECTED //////////////////////


// Mock UserContext values
// jest.fn() can be checked on how many times it has been called.
const contextValue = {
  isConnected: false,
  setIsConnected: jest.fn(),
  removeIsConnected: jest.fn(),
};



describe('/probe/0/monitoring/1 route connected', () => {
    it('checks the MenuDrawer and the Chart component  are rendered.', async () => {
  
  
      expect(true).toBeTruthy();

    });
  
  });