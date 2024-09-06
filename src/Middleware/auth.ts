import { Request, Response, NextFunction } from 'express';

export function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
    if (req.session && req.session.user) {
        next();
    } else {
        if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
            next('Unauthorized')
        } else {
            res.redirect('/');
        }
    }
}
