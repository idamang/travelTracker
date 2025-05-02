import * as countryService from '../services/countryService';

export const getCountryByName = async ({ name }: { name: string }) => {
  return await countryService.getCountryByName(name);
};

export const getCountryByCca3 = async ({ cca3 }: { cca3: string }) => {
  return await countryService.getCountryByCca3(cca3);
};

export const getCountriesPaginated = async (
  { page, pageSize, orderBy, ascOrDesc, search }: 
  { page: number; pageSize: number; orderBy: string; ascOrDesc: string; search?: string }
) => {
  return await countryService.getCountriesPaginated(page, pageSize, orderBy, ascOrDesc, search ?? null);
};
