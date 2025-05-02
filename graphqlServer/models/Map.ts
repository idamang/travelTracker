import { Sequelize, DataTypes, Model } from 'sequelize';

// Define the Map model
class Map extends Model {
  public id!: number;
  public map_name!: string;
  public geojson_data!: string;
  public created_at!: Date;
  public country_id!: number | null;
}

export const initMapModel = (sequelize: Sequelize) => {
  Map.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      map_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      geojson_data: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      country_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'countries',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    },
    {
      tableName: 'maps',
      sequelize,
      timestamps: false,
    }
  );

  return Map;
};

export default Map;
