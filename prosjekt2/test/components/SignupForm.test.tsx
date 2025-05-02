import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupForm from '../../src/components/SignupForm';
import { MockedProvider } from '@apollo/client/testing';
import { GET_COUNTRIES } from '../../src/service/queries';
import React from 'react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';

describe('SignupForm Component', () => {
  const mockSetError = vi.fn();
  const mockOnSignup = vi.fn().mockResolvedValueOnce(undefined);

  const mocks = [
    {
      request: {
        query: GET_COUNTRIES,
        variables: {
          page: 1,
          pageSize: 5,
          orderBy: 'country_name',
          search: 'Nor',
          ascOrDesc: 'asc',
        },
      },
      result: {
        data: {
          getCountriesPaginated: {
            totalPages: 1,
            countries: [
              {
                id: '1',
                country_name: 'Norway',
                cca3: 'NOR',
                capital: 'Oslo',
                image_url: 'https://example.com/norway.png',
                average_rating: 4.5,
              },
              {
                id: '2',
                country_name: 'Sweden',
                cca3: 'SWE',
                capital: 'Stockholm',
                image_url: 'https://example.com/sweden.png',
                average_rating: 4.3,
              },
            ],
          },
        },
      },
    },
  ];

  it('renders the form correctly', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <SignupForm setError={mockSetError} onSignup={mockOnSignup} />
      </MockedProvider>
    );

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Create Account/i })
    ).toBeInTheDocument();
  });

  it('submits the form with valid data', async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <SignupForm setError={mockSetError} onSignup={mockOnSignup} />
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'Test Name' },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test.name@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'securepassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(mockOnSignup).toHaveBeenCalledTimes(1);
      expect(mockOnSignup).toHaveBeenCalledWith(
        'Test Name',
        'test.name@example.com',
        'securepassword',
        '',
        undefined
      );
    });
  });

  it('searches for countries and allows selection', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SignupForm setError={mockSetError} onSignup={mockOnSignup} />
      </MockedProvider>
    );

    const countryInput = screen.getByPlaceholderText('Search for a country');
    fireEvent.change(countryInput, { target: { value: 'Nor' } });

    await waitFor(() => {
      expect(screen.getByText('Norway')).toBeInTheDocument();
      expect(screen.getByText('Sweden')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Norway'));
    expect(countryInput).toHaveValue('Norway');
  });
});
