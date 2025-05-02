import { render, screen } from '@testing-library/react';
import StatusCard from '../../src/components/StatusCard';
import { vi } from 'vitest';
import React from 'react';
import '@testing-library/jest-dom';

vi.mock('lucide-react', () => ({
  Earth: () => <div data-testid="earth-icon">Earth Icon</div>,
  MapPin: () => <div data-testid="map-pin-icon">MapPin Icon</div>,
  CalendarDays: () => (
    <div data-testid="calendar-days-icon">CalendarDays Icon</div>
  ),
}));

describe('StatusCard Component', () => {
  it('renders all status cards with correct data', () => {
    const mockUser = {
      num_countries_visited: 15,
      num_travels: 30,
      travel_days: 120,
    };

    render(<StatusCard user={mockUser} />);

    expect(screen.getByText(/Countries Visited/i)).toBeInTheDocument();
    expect(
      screen.getByText(mockUser.num_countries_visited.toString())
    ).toBeInTheDocument();
    expect(screen.getByTestId('earth-icon')).toBeInTheDocument();

    expect(screen.getByText(/Total Trips/i)).toBeInTheDocument();
    expect(
      screen.getByText(mockUser.num_travels.toString())
    ).toBeInTheDocument();
    expect(screen.getByTestId('map-pin-icon')).toBeInTheDocument();

    expect(screen.getByText(/Travel Days/i)).toBeInTheDocument();
    expect(
      screen.getByText(mockUser.travel_days.toString())
    ).toBeInTheDocument();
    expect(screen.getByTestId('calendar-days-icon')).toBeInTheDocument();
  });
});
