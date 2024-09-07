import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

export class Task extends Model {
    public id!: number;
    public user_id!: number;
    public task!: string;
    public status!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}


Task.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        task: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: 'tasks',
        timestamps: true, // Use custom timestamps
    }
);

export default Task;