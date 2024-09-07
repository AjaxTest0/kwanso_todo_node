import { Router, Request, Response } from 'express';
import { isAuthenticated } from '../Middleware/auth';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    if (req.session && req.session.user) {
        res.redirect('/token/list')
    } else {
        res.render('welcome', { pageName: 'Login' })
    }
});

router.get('/token/list', isAuthenticated, (req: Request, res: Response) => {
    res.render('token', { pageName: 'Token Lists' })
})

router.get('/tasks/list', isAuthenticated, (req: Request, res: Response) => {
    res.render('task', { pageName: 'Task Lists' })
})

router.get('/users/tasks/list', isAuthenticated, (req: Request, res: Response) => {
    res.render('user_tasks', { pageName: 'Users Task' })
})

router.get('/logout', isAuthenticated, (req: Request, res: Response) => {
    delete req.session.user
    res.redirect('/')
})


export default router;
