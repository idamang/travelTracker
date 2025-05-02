import db from '../db';

export const getUserRatingForCountry = async (userId: number, countryId: number) => {
  try {
    const rating = await db.Rating.findOne({
      where: {
        user_id: userId,
        country_id: countryId,
      },
    });

    return rating;
  } catch (error) {
    console.error('Error fetching user rating for country:', error);
    throw new Error('Could not fetch user rating for country');
  }
}

export const upsertRating = async (userId: number, countryId: number, ratingValue: number) => {
  try {
    // Check if the user has already rated the country
    const rating = await db.Rating.findOne({
      where: {
        user_id: userId,
        country_id: countryId,
      },
    });

    if (rating) {
      // Update the rating
      await db.Rating.update(
        { rating_value: ratingValue },
        { where: { user_id: userId, country_id: countryId } }
      );
    } else {
      // Create a new rating
      await db.Rating.create({
        user_id: userId,
        country_id: countryId,
        rating_value: ratingValue,
      });
    }

    return await recalculateCountryAverageRating(countryId);
  } catch (error) {
    console.error('Error upserting rating:', error);
    throw new Error('Could not upsert rating');
  }
}

const recalculateCountryAverageRating = async (countryId: number) => {
  try {
    // Calculate the average rating
    const result = await db.Rating.findAll({
      where: { country_id: countryId },
      attributes: [[db.Sequelize.fn('AVG', db.Sequelize.col('rating_value')), 'average']],
    });

    const average = parseFloat(result[0]?.dataValues?.average || 0);

    // Update the average rating in the countries table
    await db.Country.update(
      { average_rating: average },
      { where: { id: countryId } }
    );

    return average;
  } catch (error) {
    console.error('Error recalculating country average rating:', error);
    throw new Error('Could not recalculate country average rating');
  }
};


