import { Sequelize, DataTypes, Model } from 'sequelize';
import Country from './Country';
import User from './User';

export class Rating extends Model {
  public user_id!: number;
  public country_id!: number;
  public rating_value!: number;
  public timestamp!: Date;
  public country!: Country;
  public user!: User;
}

export const initRatingModel = (sequelize: Sequelize) => {
  Rating.init(
    {
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      country_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'countries',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      rating_value: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'ratings',
      sequelize,
      timestamps: false,
    }
  );

  // Define associations
  Rating.belongsTo(Country, {
    foreignKey: 'country_id',
    as: 'country',
  });

  Rating.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
  });

  return Rating;
};
