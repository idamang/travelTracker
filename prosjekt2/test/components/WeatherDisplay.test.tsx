import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WeatherDisplay } from '../../src/components/WeatherDisplay';
import React from 'react';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(() => mockNavigate),
  };
});

const mockNavigate = vi.fn();

describe('WeatherDisplay Component', () => {
  const weatherData = {
    current: {
      condition: {
        icon: 'https://example.com/weather-icon.png',
        text: 'Sunny',
      },
      temp_c: 25,
    },
  };
  const selectedCountryName = 'Norway';
  const selectedCountryCca3 = 'NOR';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders weather information correctly', () => {
    render(
      <MemoryRouter>
        <WeatherDisplay
          weatherData={weatherData}
          selectedCountryName={selectedCountryName}
          selectedCountryCca3={selectedCountryCca3}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Norway')).toBeInTheDocument();
    expect(screen.getByText('25°C')).toBeInTheDocument();
    expect(screen.getByText('Sunny')).toBeInTheDocument();
    expect(screen.getByAltText('Weather Icon')).toHaveAttribute(
      'src',
      'https://example.com/weather-icon.png'
    );
  });

  it('navigates to the correct page when clicked', () => {
    render(
      <MemoryRouter>
        <WeatherDisplay
          weatherData={weatherData}
          selectedCountryName={selectedCountryName}
          selectedCountryCca3={selectedCountryCca3}
        />
      </MemoryRouter>
    );

    const card = screen.getByText('Norway');
    fireEvent.click(card);

    expect(mockNavigate).toHaveBeenCalledWith('/nor');
  });
});
