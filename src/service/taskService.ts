import { Task } from '../models/task';
import sequelize from '../db/index';

export class TaskService {

    public static async createTask(userId: number, task: string, status: 'pending' | 'in_progress' | 'completed') {
        return Task.create({ userId, task, status });
    }

    public static async getAllTasks() {
        return Task.findAll();
    }

    public static async getTaskById(id: number) {
        return Task.findByPk(id);
    }

    public static async getTasksByUserId(userId: number) {
        return Task.findAll({ where: { user_id: userId } });
    }

    public static async updateTask(id: number, updates: Partial<Task>) {
        return Task.update(updates, { where: { id }, returning: true });
    }

    public static async deleteTask(id: number) {
        return Task.destroy({ where: { id } });
    }
}