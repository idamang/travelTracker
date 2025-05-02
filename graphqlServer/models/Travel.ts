import { Sequelize, DataTypes, Model } from 'sequelize';
import Country from './Country';

class Travel extends Model {
  public id!: number;
  public user_id!: number;
  public country_destination!: number;
  public start_date!: Date;
  public end_date!: Date;
  public image_url!: string | null;
  public description!: string | null;
  public country!: Country;
}

export const initTravelModel = (sequelize: Sequelize) => {
  Travel.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      country_destination: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'countries',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'travels',
      sequelize,
      timestamps: false,
    }
  );

  Travel.belongsTo(Country, {
    foreignKey: 'country_destination',
    as: 'country', 
  });

  return Travel;
};
