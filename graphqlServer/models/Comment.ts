import { Sequelize, DataTypes, Model } from "sequelize";
import User from "./User";
import Country from "./Country";

interface CommentAttributes {
    id: number;
    user_id: number;
    country_id: number;
    text: string;
    created_at: Date;
}

interface CommentCreationAttributes extends Omit<CommentAttributes, 'id' | 'created_at'> {}

class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
    public id!: number;
    public user_id!: number;
    public country_id!: number;
    public text!: string;
    public created_at!: Date;
}

export const initCommentModel = (sequelize: Sequelize) => {
    Comment.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            country_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            text: {
                type: DataTypes.STRING(1000),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'Comment',
            tableName: 'comments',
            timestamps: false,
        }
    );

    Comment.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user',
    });

    Comment.belongsTo(Country, {
        foreignKey: 'country_id',
        as: 'country',
    });

    return Comment;
};