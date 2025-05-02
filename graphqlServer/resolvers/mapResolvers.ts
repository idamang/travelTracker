import * as mapService from '../services/mapService';

export const getMaps = async () => {
  return await mapService.getMaps();
};

export const getMapById = async ({ id }: { id: number }) => {
  return await mapService.getMapById(id);
};
