import * as dotenv from 'dotenv';
import { Dialect, Sequelize } from 'sequelize';
import { initCountryModel } from './models/Country';
import { initMapModel } from './models/Map';
import { initRatingModel } from './models/Rating';
import { initTravelModel } from './models/Travel';
import { initUserModel } from './models/User';
import { initCommentModel } from './models/Comment';
import { getCurrentUserId, default as asyncLocalStorage } from './requestContext';

interface DbInterface {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  User: ReturnType<typeof initUserModel>;
  Map: ReturnType<typeof initMapModel>;
  Country: ReturnType<typeof initCountryModel>;
  Travel: ReturnType<typeof initTravelModel>;
  Rating: ReturnType<typeof initRatingModel>;
  Comment: ReturnType<typeof initCommentModel>;
}

dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE_NAME || 't19_p2',
  process.env.DATABASE_USER || 'root',
  process.env.DATABASE_PASSWORD || 'password',
  {
    host: process.env.DATABASE_HOST || 'it2810-19.idi.ntnu.no',
    port: Number(process.env.DATABASE_PORT) || 3306,
    dialect: 'mysql' as Dialect,
    define: {
      freezeTableName: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: (sql, timing) => logSqlQuery(sql, timing),
    benchmark: true,
    hooks: {
      beforeQuery: () => {
        asyncLocalStorage.run({ userId: getCurrentUserId() }, () => {}); // Bind context
      },
    },
  }
);

const logSqlQuery = (sql: string, time?: number, options?: { bind?: any[] }) => {
  const interpolatedQuery = options?.bind
    ? sql.replace(/\?/g, () => options.bind?.shift() ?? '?')
    : sql;

  console.log(`
    [SQL Query]
      User ID: ${getCurrentUserId() ?? 'Unknown'}
      Query: ${interpolatedQuery}
      Execution Time: ${time ? `${time} ms` : 'N/A'}
  `);
};

// Initialize models
const User = initUserModel(sequelize);
const Map = initMapModel(sequelize);
const Country = initCountryModel(sequelize);
const Travel = initTravelModel(sequelize);
const Rating = initRatingModel(sequelize);
const Comment = initCommentModel(sequelize);

// Define relationships
User.belongsTo(Country, { foreignKey: 'country_id', as: 'country' });
Country.hasMany(User, { foreignKey: 'country_id', as: 'users' });

Rating.belongsTo(User, { foreignKey: 'user_id', as: 'ratingUser' });
User.hasMany(Rating, { foreignKey: 'user_id', as: 'userRatings' });

Rating.belongsTo(Country, { foreignKey: 'country_id', as: 'ratedCountry' });
Country.hasMany(Rating, { foreignKey: 'country_id', as: 'countryRatings' });

Travel.belongsTo(User, { foreignKey: 'user_id', as: 'travelUser' });
User.hasMany(Travel, { foreignKey: 'user_id', as: 'userTravels' });

Travel.belongsTo(Country, { foreignKey: 'country_destination', as: 'travelCountry' });
Country.hasMany(Travel, { foreignKey: 'country_destination', as: 'countryTravels' });

Comment.belongsTo(User, { foreignKey: 'user_id', as: 'commentUser' });
User.hasMany(Comment, { foreignKey: 'user_id', as: 'userComments' });

Comment.belongsTo(Country, { foreignKey: 'country_id', as: 'commentCountry' });
Country.hasMany(Comment, { foreignKey: 'country_id', as: 'comments' });

const db: DbInterface = {
  sequelize,
  Sequelize,
  User,
  Map,
  Country,
  Travel,
  Rating,
  Comment,
};

export default db;
