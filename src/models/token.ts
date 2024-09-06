import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

class UserToken extends Model {
    public id!: number;
    public user_id!: number;
    public token!: string;
    public is_used!: boolean;
    public is_valid!: boolean;
    public expiry!: Date;
}

UserToken.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        is_used: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        is_valid: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        expiry: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'user_tokens',
        timestamps: false,
    }
);

export default UserToken;