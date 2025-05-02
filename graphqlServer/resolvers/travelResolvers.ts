import * as travelService from '../services/travelService';

export const getTravelsByCurrentUser = async (_: unknown, context: { userId?: number }) => {
  if (!context.userId) {
    throw new Error('Unauthorized access - Login required');
  }
  return await travelService.getTravelsByUserId(context.userId);
};

export const getTravelById = async ({ id }: { id: number }) => {
  return await travelService.getTravelById(id);
};

export const createTravel = async (
  { countryId, startDate, endDate, imageUrl, description }: 
  { countryId: number; startDate: string; endDate: string; imageUrl?: string; description?: string },
  context: { userId?: number }
) => {
  if (!context.userId) {
    throw new Error('Unauthorized access - Login required');
  }
  return await travelService.createTravel(
    context.userId, 
    countryId, 
    startDate, 
    endDate, 
    imageUrl ?? null, 
    description ?? null);
};

export const updateTravel = async (
  { travelId, startDate, endDate, imageUrl, description }: 
  { travelId: number; startDate: string; endDate: string; imageUrl?: string; description?: string }
) => {
  return await travelService.updateTravel(
    travelId, 
    startDate, 
    endDate, 
    imageUrl ?? null, 
    description ?? null
  );
};

export const getPastTravelsByCurrentUser = async (_: unknown, context: { userId?: number }) => {
  if (!context.userId) {
    throw new Error('Unauthorized access - Login required');
  }
  return await travelService.getPastTravelsByUserId(context.userId);
};