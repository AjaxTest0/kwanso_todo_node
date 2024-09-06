import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config();

interface ResponseData {
    status: number;
    body?: object;
    msg?: string;
}

export const sendResponse = (res: Response, { status, body = {}, msg }: ResponseData) => {
    const responseBody = typeof body === 'object' ? body : {};
    res.status(status).json({ msg, data: responseBody });
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ msg: 'Internal server error', error: err.message ?? err });
};
