import React from 'react';
//const React = require('react');
import { render, screen, waitFor } from '@testing-library/react';
//const {render, screen, waitFor} = require('@testing-library/react');
import ArchivedList from '../../components/ArchivedList';
//const ArchivedList = require('../../components/ArchivedList');
import {beforeEach, afterEach} from "./testing_functions";
//const {beforeEach, afterEach} = require('./testing_functions');
import axios from 'axios'; // Import axios for mocking
//const axios = require('axios');

// Mock axios and UserContext here (use jest.mock or any other approach)

describe('ArchivedList', () => {
  it('displays connected user data', async () => {
    // Mock axios and UserContext appropriately

    // Mock axios.post for fetching archived monitoring IDs
    axios.post.mockResolvedValueOnce({ data: ['id1', 'id2'] });

    // Mock axios.all for parallel requests
    axios.all.mockResolvedValueOnce([
      { data: { /* monitoring data for id1 */ } },
      { data: { /* monitoring data for id2 */ } },
    ]);

    render(<ArchivedList/> );

    // Wait for data to load
    await waitFor(() => {
      // Test assertions for rendered data
      // For example, check if table cells are present
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Start Date')).toBeInTheDocument();
      expect(screen.getByText('End Date')).toBeInTheDocument();
    });
  });

  it('displays message for disconnected user', () => {
    // Mock UserContext to simulate disconnected user
    // Render the component
    render(<ArchivedList/> );
    
    // Test assertions for the disconnected user message
    expect(screen.getByText('You need to be connected to access this page')).toBeInTheDocument();
  });

  // Add more test cases as needed
});
