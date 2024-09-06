import express, { Request, Response, NextFunction } from 'express';
import { sendResponse, errorHandler } from '../utils/helper';
import bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserService } from '../service/userService';
import { UserTokenService } from '../service/tokerService';


export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error('Email and password are required')
        }
        const user = await UserService.getUserByEmail(email)
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                next('Invalid Password');
            }
            
            req.session.user = user.toJSON();

            sendResponse(res, { status: 200, body: user.toJSON(), msg: 'User found' });
        } else {
            next('User not found');
        }
    } catch (error) {
        next(error);
    }
}

export const generateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        let user = await UserService.getUserByEmail(email)
        let token = crypto.randomBytes(length).toString('hex')
        if (user) {
            let tokenToken = await UserTokenService.getTokenByUserId(user.id)
            if (tokenToken) {
                token = tokenToken.token;
            }
        } else {
            const hashedPassword = await bcrypt.hash('password', 10);
            const expiry = new Date(Date.now() + 24 * 3600 * 1000);
            user = await UserService.createUser(email, hashedPassword, 'client')

            await UserTokenService.createUserToken(user.id, token, false, true, expiry);

        }

        sendResponse(res, { status: 200, body: {}, msg: 'Token Created Successfully' });
    } catch (error) {
        next(error);
    }
}

export const profile = async (req: Request, res: Response, next: NextFunction) => {
    res.json(req.session.user);
}