import express, { Request, Response, NextFunction } from 'express';
import { sendResponse, errorHandler } from '../utils/helper';
import { UserService } from '../service/userService';
import { UserTokenService } from '../service/tokerService';
import { TaskService } from '../service/taskService';
import session from 'express-session';

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, task, status } = req.body;
        if (!task || !status) {
            throw new Error('task and status are required');
        }
        const user_id = req.session.user.id

        const validStatuses = ['pending', 'in_progress', 'completed'];
        if (!validStatuses.includes(status)) {
            throw new Error('Invalid status');
        }

        const newTask = await TaskService.createTask(userId, task, status);
        sendResponse(res, { status: 201, body: newTask, msg: 'Task created successfully' });
    } catch (error) {
        next(error);
    }
};


export const getTasksByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = parseInt(req.params.userId, 10);
        if (isNaN(userId)) {
            throw new Error('Invalid user ID');
        }

        const tasks = await TaskService.getTasksByUserId(userId);
        sendResponse(res, { status: 200, body: tasks, msg: 'Tasks retrieved successfully' });
    } catch (error) {
        next(error);
    }
};

export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            throw new Error('Invalid task ID');
        }

        const task = await TaskService.getTaskById(id);
        if (task) {
            sendResponse(res, { status: 200, body: task, msg: 'Task retrieved successfully' });
        } else {
            sendResponse(res, { status: 404, body: {}, msg: 'Task not found' });
        }
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        const updates = req.body;

        if (isNaN(id)) {
            throw new Error('Invalid task ID');
        }

        const [updatedCount, updatedTasks] = await TaskService.updateTask(id, updates);
        if (updatedCount > 0) {
            sendResponse(res, { status: 200, body: updatedTasks, msg: 'Task updated successfully' });
        } else {
            sendResponse(res, { status: 404, body: {}, msg: 'Task not found' });
        }
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            throw new Error('Invalid task ID');
        }

        const deletedCount = await TaskService.deleteTask(id);
        if (deletedCount > 0) {
            sendResponse(res, { status: 204, body: {}, msg: 'Task deleted successfully' });
        } else {
            sendResponse(res, { status: 404, body: {}, msg: 'Task not found' });
        }
    } catch (error) {
        next(error);
    }
};