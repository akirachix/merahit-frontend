import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useVendors } from './index'; 
import * as fetchAPI from '../../utils/fetchAPI';


jest.mock('../../utils/fetchAPI');

const TestVendorsComponent = () => {
  const { vendors, loading, error } = useVendors();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {vendors.map((v) => (
        <div key={v.id}>
          <p>{v.full_name}</p>
          <p>{v.usertype}</p>
        </div>
      ))}
    </div>
  );
};

describe('useVendors hook (tested via test component)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fetches and displays vendor data', async () => {
    
    const mockUsers = [
      { id: 1, full_name: 'Vendor One', usertype: 'mamamboga' },
      { id: 2, full_name: 'Customer One', usertype: 'customer' },
      { id: 3, full_name: 'Vendor Two', usertype: 'mamamboga' },
    ];
    fetchAPI.fetchData.mockResolvedValueOnce(mockUsers);

  
    render(<TestVendorsComponent />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    
    expect(screen.getByText('Vendor One')).toBeInTheDocument();
    expect(screen.getByText('Vendor Two')).toBeInTheDocument();

    expect(screen.queryByText('Customer One')).not.toBeInTheDocument();
  });

  test('handles fetch error correctly', async () => {
    fetchAPI.fetchData.mockRejectedValueOnce(new Error('Fetch failed'));

    render(<TestVendorsComponent />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/error: fetch failed/i)).toBeInTheDocument();
    });
  });
});
