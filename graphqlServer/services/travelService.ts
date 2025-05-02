import db from "../db";

export const createTravel = async (
  userId: number,
  countryId: number,
  startDate: string,
  endDate: string,
  imageUrl: string | null,
  description: string | null
) => {
  try {
    const travel = await db.Travel.create({
      user_id: userId,
      country_destination: countryId,
      start_date: startDate,
      end_date: endDate,
      image_url: imageUrl,
      description: description,
    });

    // Fetch the associated country to include in the response
    const travelWithCountry = await db.Travel.findOne({
      where: { id: travel.id },
      include: [
        {
          model: db.Country,
          as: 'country',
        },
      ],
    });

    return travelWithCountry;
  } catch (error) {
    console.error(`Error creating travel for user ${userId}:`, error);
    throw new Error('Could not create travel');
  }
};


export const getTravelsByUserId = async (userId: number) => {
  try {
    const travels = await db.Travel.findAll({
      where: { user_id: userId },
      include: [
        {
          model: db.Country,
          as: 'country',
          attributes: { exclude: [] },
        },
      ],
    });

    return travels.map(travel => ({
      ...travel.toJSON(),
      country_name: travel.country?.country_name || null,
      image_url: travel.image_url,
      description: travel.description,
    }));
  } catch (error) {
    console.error(`Error fetching travels for user ${userId}:`, error);
    throw new Error('Could not fetch travels');
  }
};

export const getTravelById = async (travelId: number) => {
  try {
    const travel = await db.Travel.findOne({
      where: { id: travelId },
      include: [
        {
          model: db.Country,
          as: 'country',
        },
      ],
    });

    if (!travel) {
      throw new Error(`No travel found with id ${travelId}`);
    }

    return {
      ...travel.toJSON(),
      country_name: travel.country.country_name,
      image_url: travel.image_url,
      description: travel.description,
    };
  } catch (error) {
    console.error(`Error fetching travel with id ${travelId}:`, error);
    throw new Error('Could not fetch travel');
  }
}

export const updateTravel = async ( travelId: number, startDate: string, endDate: string, imageUrl: string | null, description: string | null) => {
  try {
    const travel = await db.Travel.findOne({
      where: { id: travelId },
    });

    if (!travel) {
      throw new Error(`No travel found with id ${travelId}`);
    }

    await travel.update({
      start_date: startDate,
      end_date: endDate,
      image_url: imageUrl,
      description: description,
    });

    return travel;
  } catch (error) {
    console.error(`Error updating travel with id ${travelId}:`, error);
    throw new Error('Could not update travel');
  }
}

export const getPastTravelsByUserId = async (userId: number) => {
  try {
    const travels = await db.Travel.findAll({
      where: { user_id: userId },
      include: [
        {
          model: db.Country,
          as: "country",
        },
      ],
    });
    const today = new Date();
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const pastTravels = travels.filter((travel) => {
      const endDate = new Date(travel.end_date);
      return endDate < normalizedToday;
    });



    const activeTravel = travels.find((travel) => {
      const startDate = new Date(travel.start_date);
      const endDate = new Date(travel.end_date);
      return startDate <= normalizedToday && endDate >= normalizedToday;
    });

    return {
      past_travels: pastTravels.length > 0
        ? pastTravels.map((travel) => ({
            ...travel.toJSON(),
            country_name: travel.country?.country_name || null,
          }))
        : [], // Ensure it's an empty array, not null
      active_travel: activeTravel
        ? {
            ...activeTravel.toJSON(),
            country_name: activeTravel.country?.country_name || null,
          }
        : null, // Active travel can be null if no current travel is active
    };
  } catch (error) {
    console.error(`Error fetching past travels for user ${userId}:`, error);
    throw new Error("Could not fetch past travels");
  }
};
