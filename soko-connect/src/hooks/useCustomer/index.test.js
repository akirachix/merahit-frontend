import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useCustomers } from './index'; 
import * as fetchAPI from '../../utils/fetchAPI';


jest.mock('../../utils/fetchAPI');

const TestComponent = () => {
  const { customers, loading, error } = useCustomers();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {customers.map((c) => (
        <div key={c.id}>
          <p>{c.full_name}</p>
          <p>{c.usertype}</p>
        </div>
      ))}
    </div>
  );
};

describe('useCustomers hook (tested via test component)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fetches and displays customer data', async () => {
   
    const mockUsers = [
      { id: 1, full_name: 'John Doe', usertype: 'customer' },
      { id: 2, full_name: 'Jane Smith', usertype: 'vendor' },
      { id: 3, full_name: 'Mary Johnson', usertype: 'customer' },
    ];
    fetchAPI.fetchData.mockResolvedValueOnce(mockUsers);

   
    render(<TestComponent />);

    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

   
    await waitFor(() => {
     
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

  
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Mary Johnson')).toBeInTheDocument();

 
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  test('handles error from fetchData', async () => {
    fetchAPI.fetchData.mockRejectedValueOnce(new Error('Network Error'));

    render(<TestComponent />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/error: network error/i)).toBeInTheDocument();
    });
  });
});
