import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MockedProvider } from '@apollo/client/testing';
import ProfileCard from '../../src/components/ProfileCard';
import { UPDATE_USER } from '../../src/service/mutations';
import { GET_USER_PROFILE } from '../../src/service/queries';
import React from 'react';

describe('ProfileCard Component', () => {
  const userMock = {
    id: 1,
    name: 'Name Name',
    email: 'name@example.com',
    address: '123 Street, City',
    country: {
      id: 1,
      country_name: 'Norway',
    },
  };

  const mocks = [
    {
      request: {
        query: GET_USER_PROFILE,
        variables: {},
      },
      result: {
        data: {
          getCurrentUser: {
            id: 1,
            name: 'Name Name',
            email: 'name@example.com',
            address: '123 Street, City',
            travel_days: 10,
            num_travels: 5,
            num_countries_visited: 3,
            country: {
              id: 1,
              cca3: 'NOR',
              country_name: 'Norway',
            },
          },
        },
      },
    },
    {
      request: {
        query: UPDATE_USER,
        variables: {
          id: 1,
          name: 'Updated Name',
          email: 'name@example.com',
          address: 'Updated Address',
          countryId: 1,
        },
      },
      result: {
        data: {
          updateUser: {
            id: 1,
            name: 'Updated Name',
            email: 'name@example.com',
            address: 'Updated Address',
            country_id: 1,
          },
        },
      },
    },
  ];

  it('renders user profile information', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ProfileCard user={userMock} />
      </MockedProvider>
    );

    expect(screen.getByText(/name name/i)).toBeInTheDocument();
    expect(screen.getByText(/name@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/123 street, city/i)).toBeInTheDocument();
    expect(screen.getByText(/norway/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });

  it('allows user to edit their profile and saves successfully', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ProfileCard user={userMock} />
      </MockedProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    const nameInput = screen.getByLabelText(/name/i);
    const addressInput = screen.getByLabelText(/address/i);
    expect(nameInput).toBeInTheDocument();
    expect(addressInput).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
    fireEvent.change(addressInput, { target: { value: 'Updated Address' } });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(nameInput).toHaveValue('Updated Name');
      expect(addressInput).toHaveValue('Updated Address');
    });
  });

  it('allows user to cancel editing', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ProfileCard user={userMock} />
      </MockedProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    const nameInput = screen.getByLabelText(/name/i);
    const addressInput = screen.getByLabelText(/address/i);
    expect(nameInput).toBeInTheDocument();
    expect(addressInput).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: 'Temporary Name' } });
    fireEvent.change(addressInput, { target: { value: 'Temporary Address' } });

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    await waitFor(() => {
      expect(screen.getByText(/name name/i)).toBeInTheDocument();
      expect(screen.getByText(/123 street, city/i)).toBeInTheDocument();
    });
  });
});
