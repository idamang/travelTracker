import { Op } from 'sequelize';
import db from '../db';

export const getCountryByName = async (name: string) => {
    try {
        const country = await db.Country.findOne({ where: { country_name: name } });
        if (!country) {
            throw new Error(`Country with name ${name} not found`);
        }
        return country;
    } catch (error) {
        console.error(`Error fetching country by name ${name}:`, error);
        throw new Error('Could not fetch country');
    }
};

export const getCountryByCca3 = async (cca3: string) => {
    try {
        const country = await db.Country.findOne({ where: { cca3 } });
        if (!country) {
            throw new Error(`Country with cca3 ${cca3} not found`);
        }
        return country;
    } catch (error) {
        console.error(`Error fetching country by cca3 ${cca3}:`, error);
        throw new Error('Could not fetch country');
    }
};

export const getCountriesPaginated = async (
  page: number,
  pageSize: number,
  orderBy: string,
  ascOrDesc: string,
  search: string | null
) => {
  try {
    const offset = (page - 1) * pageSize;
    const orderColumn = ['country_name', 'cca3', 'tourism', 'average_rating'].includes(orderBy) ? orderBy : 'tourism';
    const orderDirection = ['ASC', 'DESC'].includes(ascOrDesc.toUpperCase()) ? ascOrDesc.toUpperCase() : 'DESC';

    // Build the filtering condition (search)
    const whereClause: any = search
      ? {
          [Op.or]: [
            { country_name: { [Op.like]: `%${search}%` } },
            { cca3: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    // Add condition to only include countries with ratings if sorting by average_rating
    if (orderColumn === 'average_rating') {
      whereClause.average_rating = { [Op.not]: 0 };
    }

    // Fetch the paginated and sorted data
    const countries = await db.Country.findAll({
      where: whereClause,
      order: [[orderColumn, orderDirection]],
      limit: pageSize,
      offset: offset,
    });

    const totalRecords = await db.Country.count({ where: whereClause });
    const totalPages = Math.ceil(totalRecords / pageSize);

    return { countries, totalPages };
  } catch (error) {
    console.error('Error fetching paginated countries:', error);
    throw new Error('Could not fetch countries');
  }
};
