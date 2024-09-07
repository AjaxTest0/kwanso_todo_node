import { Task } from '../models/task';
import User from '../models/user';
import sequelize from '../db/index';
import { QueryTypes } from 'sequelize';

export class TaskService {

    public static async createTask(userId: number, task: string, status: 'pending' | 'in_progress' | 'completed') {

        return Task.create({ user_id: userId, task: task, status: status });
    }

    public static async getAllTasks() {
        return Task.findAll({ order: [['createdAt', 'DESC']] });
    }

    public static async getTaskById(id: number) {
        return Task.findByPk(id);
    }

    public static async getTasksByUserId(userId: number) {
        return Task.findAll({ where: { user_id: userId }, order: [['createdAt', 'DESC']] });
    }

    public static async updateTask(id: number, task: string, status: 'pending' | 'in_progress' | 'completed') {

        return Task.update({ task: task, status: status }, { where: { id } });
    }

    public static async deleteTask(id: number) {
        return Task.destroy({ where: { id } });
    }

    // public static async getAllTasksWithUsers(page: number = 1, perPage: number = 10) {
    //     try {
    //         const offset = (page - 1) * perPage;

    //         // const { count, rows } = 
    //         const { count, rows } = await Task.findAndCountAll({
    //             include: [{
    //                 model: User,
    //                 attributes: ['name'],
    //             }],
    //             limit: perPage,
    //             offset: offset,
    //             order: [['date', 'DESC']],
    //         })
    //         console.log("🚀 ~ count, rows>>", count, rows)
    //         console.log("🚀 ~ here>>")

    //         const totalPages = Math.ceil(count / perPage);

    //         return {
    //             tasks: rows,
    //             currentPage: page,
    //             totalPages: totalPages,
    //         };
    //     } catch (err) {
    //     console.log("🚀 ~ err>>", err)

    //     }

    // }

    public static async getAllTasksWithUsers(page: number = 1, perPage: number = 10, email: string = '', status: string = '') {
        try {
            const offset = (page - 1) * perPage;

            // Build the WHERE clause dynamically based on filters
            let whereClause = '';
            const replacements: any = { limit: perPage, offset: offset };

            if (email) {
                whereClause += ' AND users.email LIKE :email';
                replacements.email = `%${email}%`;
            }
            if (status) {
                whereClause += ' AND tasks.status LIKE :status';
                replacements.status = `%${status}%`;
            }

            // Complete SQL query with dynamic WHERE clause
            const tasksQuery = `
                SELECT 
                    tasks.id, 
                    tasks.createdAt, 
                    tasks.task, 
                    tasks.status, 
                    users.email AS name
                FROM 
                    tasks
                INNER JOIN 
                    users ON tasks.user_id = users.id
                WHERE 
                    1=1 ${whereClause}
                ORDER BY 
                    tasks.createdAt DESC
                LIMIT :limit
                OFFSET :offset
            `;

            const countQuery = `
                SELECT 
                    COUNT(*) AS total
                FROM 
                    tasks
                INNER JOIN 
                    users ON tasks.user_id = users.id
                WHERE 
                    1=1 ${whereClause}
            `;

            // Execute queries
            const tasks = await sequelize.query(tasksQuery, {
                replacements,
                type: QueryTypes.SELECT,
            });

            const totalCountResult = await sequelize.query(countQuery, {
                replacements,
                type: QueryTypes.SELECT,
            });

            const totalTasks = totalCountResult[0].total;
            const totalPages = Math.ceil(totalTasks / perPage);

            return {
                tasks,
                currentPage: page,
                totalPages: totalPages,
            };
        } catch (err) {
            console.log("🚀 ~ err>>", err);
            throw err; // Consider throwing the error to be handled by the caller
        }
    }

}