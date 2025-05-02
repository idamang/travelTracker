import { UPSERT_RATING } from '@/service/mutations';
import { GET_USER_RATING_FOR_COUNTRY } from '@/service/queries';
import { Country } from '@/service/types';
import { useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';

interface StarRatingProps {
  country: Country;
  maxStars?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ country, maxStars = 5 }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const { loading, error } = useQuery(GET_USER_RATING_FOR_COUNTRY, {
    variables: { countryId: country.id },
    onCompleted: (data) => {
      if (data?.getUserRatingForCountry) {
        setRating(data.getUserRatingForCountry.rating_value);
      }
    },
    onError: (error) => console.error('Error loading rating:', error),
  });

  // Define mutations for adding and updating ratings
  const [upsertRating] = useMutation(UPSERT_RATING, {
    update: (cache, { data }, { context }) => {
      if (context) {
        const { countryId, ratingValue } = context;

        cache.writeQuery({
          query: GET_USER_RATING_FOR_COUNTRY,
          variables: { countryId },
          data: {
            getUserRatingForCountry: {
              __typename: 'UserRating',
              rating_value: ratingValue,
            },
          },
        });
      }
      cache.modify({
        id: `Country:${country.id}`,
        fields: {
          average_rating: () => data.upsertRating.average_rating,
        },
      });
    },
    onError: (error) => console.error('Error updating rating:', error),
  });

  const handleClick = async (index: number) => {
    setRating(index);

    // Set the session storage flag for ratings change
    sessionStorage.setItem('ratingsChanged', 'true');

    // Perform the rating mutation
    await upsertRating({
      variables: { countryId: country.id, ratingValue: index },
      context: { countryId: country.id, ratingValue: index },
    });
  };

  const handleMouseEnter = (index: number) => setHoverRating(index);
  const handleMouseLeave = () => setHoverRating(0);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading rating.</p>;

  return (
    <div
      className="flex space-x-1 sm:space-x-0.5 sm:max-w-[150px] md:max-w-[200px]"
      role="radiogroup"
      aria-label="Star rating"
    >
      {Array.from({ length: maxStars }, (_, index) => index + 1).map((star) => (
        <svg
          key={star}
          className={`cursor-pointer ${
            hoverRating >= star || (!hoverRating && rating >= star)
              ? 'text-yellow-400'
              : 'text-gray-300'
          } w-6 h-6`}
          fill="currentColor"
          viewBox="0 0 24 24"
          role="radio"
          aria-checked={rating === star}
          aria-label={`${star} of ${maxStars} stars`}
          tabIndex={0}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;
