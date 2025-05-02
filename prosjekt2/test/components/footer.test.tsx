import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import Footer from '../../src/components/Footer';

describe('Footer Component', () => {
  it('renders the footer correctly', () => {
    render(<Footer />);

    expect(
      screen.getByText(/© 2024 TravelTracker. All rights reserved./i)
    ).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /Get Started/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/project2/get-started');
  });
});
