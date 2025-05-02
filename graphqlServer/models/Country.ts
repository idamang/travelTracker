import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

// Define the attributes for the Country model
interface CountryAttributes {
  id: number;
  country_name: string;
  cca3: string | null;
  continent: string | null;
  population: number | null;
  currency: string | null;
  official_language: string | null;
  country_code: string | null;
  tourism: number | null;
  capital: string | null;
  image_url: string | null;
  average_rating: number | null;
}

interface CountryCreationAttributes extends Optional<CountryAttributes, 'id' | 'cca3' | 'continent' | 'population' | 'currency' | 'official_language' | 'country_code' | 'tourism' | 'capital' | 'image_url' | 'average_rating'> {}

class Country extends Model<CountryAttributes, CountryCreationAttributes> implements CountryAttributes {
  public id!: number;
  public country_name!: string;
  public cca3!: string | null;
  public continent!: string | null;
  public population!: number | null;
  public currency!: string | null;
  public official_language!: string | null;
  public country_code!: string | null;
  public tourism!: number | null;
  public capital!: string | null;
  public image_url!: string | null;
  public average_rating!: number | null;
}

export const initCountryModel = (sequelize: Sequelize) => {
  Country.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      country_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      cca3: {
        type: DataTypes.STRING(3),
        allowNull: true,
        unique: true,
        validate: {
          len: [3, 3],
        },
      },
      continent: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      population: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        validate: {
          min: 0,
        },
      },
      currency: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      official_language: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      country_code: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      tourism: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
      capital: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      image_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      average_rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
        validate: {
          min: 0,
        },
      },
    },
    {
      tableName: 'countries',
      sequelize,
      timestamps: false,
    }
  );

  return Country;
};

export default Country;
