import express, { Request, Response, NextFunction } from 'express';
import { sendResponse, errorHandler } from '../utils/helper';
import { UserService } from '../service/userService';
import { UserTokenService } from '../service/tokerService';
import { TaskService } from '../service/taskService';
import session from 'express-session';


export const saveTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { task, status, id } = req.body;
        console.log("🚀 ~ task, status, id>>", task, status, id)

        const user_id = req.session.user.id;
        console.log("🚀 ~ user_id>>", user_id);

        if (!task || !status) {
            throw new Error('task and status are required');
        }

        const validStatuses = ['pending', 'in_progress', 'completed'];
        if (!validStatuses.includes(status)) {
            throw new Error('Invalid status');
        }

        let response;
        if (id && id > 0) {
            const affectedRows = await TaskService.updateTask(id, task, status);
            console.log("🚀 ~ affectedRows>>", affectedRows)

            if (affectedRows) {
                sendResponse(res, { status: 200, body: response, msg: 'Task updated successfully' });
            } else {
                throw new Error('Task not found');
            }
        } else {
            response = await TaskService.createTask(user_id, task, status);
            sendResponse(res, { status: 201, body: response, msg: 'Task created successfully' });
        }
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
            sendResponse(res, { status: 200, body: {}, msg: 'Task deleted successfully' });
        } else {
            sendResponse(res, { status: 404, body: {}, msg: 'Task not found' });
        }

    } catch (error) {
        next(error);
    }

};
export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
    const cursor = parseInt(req.query.cursor as string) || 1;
    const perPage = parseInt(req.query.perPage as string) || 10;
    const email = req.query.email as string;
    const status = req.query.status as string;

    try {
        const result = await TaskService.getAllTasksWithUsers(cursor, perPage, email, status);
        sendResponse(res, { status: 200, body: { result }, msg: 'Tasks List' });
    } catch (error) {
        next(error); // Pass the error to the error handler middleware
    }
}