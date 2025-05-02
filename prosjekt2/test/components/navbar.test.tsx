import { MockedProvider } from '@apollo/client/testing';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import Navbar from '../../src/components/navbar';

describe('Navbar Component', () => {
  it('renders the navbar correctly', () => {
    render(
      <MemoryRouter>
        <MockedProvider>
          <Navbar />
        </MockedProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('TravelTracker')).toBeInTheDocument();
    expect(screen.getByText('My travels')).toBeInTheDocument();
    expect(screen.getByText('Map')).toBeInTheDocument();
    expect(screen.getByText('Explore')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('registered as button', () => {
    render(
      <MemoryRouter>
        <MockedProvider>
          <Navbar />
        </MockedProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Profile').closest('button')).toBeInTheDocument();
    expect(screen.getByText('Explore').closest('button')).toBeInTheDocument();
    expect(screen.getByText('Map').closest('h1')).not.toBeInTheDocument();
    expect(
      screen.getByText('My travels').closest('button')
    ).toBeInTheDocument();
    expect(
      screen.getByText('TravelTracker').closest('button')
    ).not.toBeInTheDocument();
  });
});
