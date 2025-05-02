import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import TripsCard from '../../src/components/myTripsCard';
import '@testing-library/jest-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('TripsCard Component', () => {
  const mockNavigate = vi.fn();
  const mockOnSwitchChange = vi.fn();

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders correctly with switch off', () => {
    render(
      <MemoryRouter>
        <TripsCard isSwitchOn={false} onSwitchChange={mockOnSwitchChange} />
      </MemoryRouter>
    );

    expect(screen.getByText(/my travels/i)).toBeInTheDocument();
    expect(screen.getByText(/see your travel history/i)).toBeInTheDocument();
    expect(screen.getByText(/showing past travels/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add new trip/i })
    ).toBeInTheDocument();
  });

  it('renders correctly with switch on', () => {
    render(
      <MemoryRouter>
        <TripsCard isSwitchOn={true} onSwitchChange={mockOnSwitchChange} />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/showing all upcoming travels/i)
    ).toBeInTheDocument();
  });

  it('calls onSwitchChange when switch is toggled', () => {
    render(
      <MemoryRouter>
        <TripsCard isSwitchOn={false} onSwitchChange={mockOnSwitchChange} />
      </MemoryRouter>
    );

    const switchElement = screen.getByRole('switch', {
      name: /showing past travels/i,
    });
    fireEvent.click(switchElement);

    expect(mockOnSwitchChange).toHaveBeenCalledTimes(1);
  });

  it('navigates to new trip page when "Add New Trip" button is clicked', () => {
    render(
      <MemoryRouter>
        <TripsCard isSwitchOn={false} onSwitchChange={mockOnSwitchChange} />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: /add new trip/i });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/mytravels/newtrip');
  });
});
