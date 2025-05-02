import e from 'express';
import * as ratingService from '../services/ratingService';

export const getUserRatingForCountry = async (
  {countryId }: {countryId: number },
  context: {userId: number}
) => {
  return await ratingService.getUserRatingForCountry(context.userId, countryId);
}

export const upsertRating = async (
  {countryId, ratingValue }: {countryId: number, ratingValue: number},
  context: {userId: number}
) => {
  return await ratingService.upsertRating(context.userId, countryId, ratingValue);
}
