import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Trip from '../../src/components/tripCard';

describe('Trip Component', () => {
  const mockTrip = {
    country: 'Norway',
    image: 'https://example.com/norway.jpg',
    date: '2023-11-20',
  };

  it('renders the card with correct country name, image, and date', () => {
    render(
      <Trip
        country={mockTrip.country}
        image={mockTrip.image}
        date={mockTrip.date}
      />
    );

    expect(screen.getByText(/norway/i)).toBeInTheDocument();

    const image = screen.getByRole('img', { name: /norway/i });
    expect(image).toHaveAttribute('src', 'https://example.com/norway.jpg');
    expect(image).toHaveAttribute('alt', 'Norway');

    expect(screen.getByText(/visited: 2023-11-20/i)).toBeInTheDocument();
  });

  it('renders the "See trip" button and allows clicking', () => {
    render(
      <Trip
        country={mockTrip.country}
        image={mockTrip.image}
        date={mockTrip.date}
      />
    );

    const seeTripButton = screen.getByRole('button', { name: /see trip/i });
    expect(seeTripButton).toBeInTheDocument();

    fireEvent.click(seeTripButton);
  });
});
