import db from "../db";
import { Op } from 'sequelize';
import bcrypt from 'bcryptjs';

export const getUsers = async () => {
    try {
      const users = await db.User.findAll();
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Could not fetch users');
    }
}

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.User.findOne({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error(`Error fetching user by email ${email}:`, error);
    throw new Error('Email already in use');
  }
};

export const createUser = async ({
  name,
  email,
  password,
  address,
  countryId,
}: {
  name: string;
  email: string;
  password: string;
  address?: string;
  countryId?: number;
}) => {
  console.log('Creating user:', name, email, password, address, countryId);
  
  try {
    // Check if the email is already registered
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    // Hash the password
    const password_hash = await bcrypt.hash(password, 10);

    // Build user data with optional address and countryId
    const userData: {
      name: string;
      email: string;
      password_hash: string;
      created_at: Date;
      address?: string;
      country_id?: number;
    } = {
      name,
      email,
      password_hash,
      created_at: new Date(),
    };

    if (address) {
      userData.address = address;
    }

    if (countryId) {
      const countryExists = await db.Country.findByPk(countryId);
      if (!countryExists) {
        throw new Error(`Country with ID ${countryId} does not exist`);
      }
      userData.country_id = countryId;
    }

    // Create the user with the constructed userData
    const user = await db.User.create(userData);

    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Country with ID 99 does not exist');
  }
};


export const getUserById = async (id: number) => {
  try {
    const user = await db.User.findByPk(id, {
      include: {
        model: db.Country,
        as: 'country',
      },
    });
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    const completedTravels = await db.Travel.findAll({
      where: {
        user_id: id,
        end_date: { [Op.lte]: new Date() },
      },
    });

    const completedCountryIds = completedTravels.map((travel) => travel.country_destination);
    const uniqueCountryIds = [...new Set([ ...completedCountryIds])];

    const uniqueCountries = await db.Country.findAll({
      where: {
        id: uniqueCountryIds,
      },
    });

    const ongoingTravel = await db.Travel.findOne({
      where: {
        user_id: id,
        start_date: { [Op.lte]: new Date() },
        end_date: { [Op.gt]: new Date() },
      },
    });

    let currentCountry;
    if (ongoingTravel) {
      currentCountry = await db.Country.findByPk(ongoingTravel.country_destination);
    } else if (user.country_id) {
      currentCountry = await db.Country.findByPk(user.country_id);
    }

    const numTravels = completedTravels.length;

    const travelDays = completedTravels.reduce((total, travel) => {
      const startDate = new Date(travel.start_date);
      const endDate = new Date(travel.end_date);
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      return total + days;
    }, 0);

    return {
      ...user.toJSON(),
      visitedCountries: uniqueCountries,
      num_countries_visited: uniqueCountries.length,
      num_travels: numTravels,
      travel_days: travelDays,
      currentCountry,
    };
  } catch (error) {
    console.error(`Error fetching user by id ${id}:`, error);
    throw new Error('Could not fetch user');
  }
};

export const updateUser = async (
  id: number,
  name: string,
  email: string,
  address?: string,
  countryId?: number
) => {
  try {
    // Find the user by ID
    const user = await db.User.findByPk(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    // Update mandatory fields
    user.name = name;
    user.email = email;

    // Conditionally update address if provided
    if (address) {
      user.address = address;
    }

    // Conditionally update countryId if provided
    if (countryId) {
      // Verify if the countryId exists in the Country model
      // const countryExists = await db.Country.findByPk(countryId);
      const countryExists = await db.Country.findByPk(countryId);
      if (!countryExists) {
        throw new Error(`Country with ID ${countryId} does not exist`);
      }
      user.country_id = countryId;
    }

    // Save the changes
    await user.save();

    return user;
  } catch (error) {
    console.error(`Error updating user with id ${id}:`, error);
    throw new Error('Could not update user');
  }
};

