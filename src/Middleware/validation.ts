import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { errorHandler } from '../utils/helper';

export const loginValidationRules = [
    body('email').isEmail().withMessage('Invalid email format '),
    body('password').notEmpty().withMessage('Password is required ')
];

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        next(errorMessages.join(''));
    }
    next();
};
