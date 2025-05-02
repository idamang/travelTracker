import { MockedProvider } from '@apollo/client/testing';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import StarRating from '../../src/components/StarRating';
import { UPSERT_RATING } from '../../src/service/mutations';
import { GET_USER_RATING_FOR_COUNTRY } from '../../src/service/queries';

describe('StarRating Component', () => {
  const mocks = [
    {
      request: {
        query: GET_USER_RATING_FOR_COUNTRY,
        variables: { countryId: 1 },
      },
      result: {
        data: {
          getUserRatingForCountry: {
            rating_value: 3,
          },
        },
      },
    },
    {
      request: {
        query: UPSERT_RATING,
        variables: { countryId: 1, ratingValue: 5 },
      },
      result: {
        data: {
          upsertRating: true,
        },
      },
    },
  ];

  it('highlights stars on hover and updates rating on click', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <StarRating country={{ id: 1, country_name: 'Norway' }} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByRole('radio')[2]).toHaveAttribute(
        'aria-checked',
        'true'
      );
    });

    const stars = screen.getAllByRole('radio');

    fireEvent.mouseEnter(stars[4]);
    expect(stars[0]).toHaveClass('text-yellow-400');
    expect(stars[4]).toHaveClass('text-yellow-400');

    fireEvent.click(stars[4]);

    await waitFor(() => {
      expect(stars[4]).toHaveAttribute('aria-checked', 'true');
    });
  });
});
