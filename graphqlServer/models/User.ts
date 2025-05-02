import { Sequelize, DataTypes, Model } from 'sequelize';

class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string | null;
  public created_at!: Date;
  public country_id!: number | null;
  public address!: string | null;
  public password_hash!: string;  // New field to store hashed password
}

export const initUserModel = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(60),
        allowNull: true,
        unique: true, // Ensures unique email addresses
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      country_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'countries',
          key: 'id',
        },
        onDelete: 'SET NULL',
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: 'users',
      sequelize,
      timestamps: false,
    }
  );

  return User;
};

export default User;