import { Router } from 'express';
import { loginUser, profile, generateToken } from '../controllers/userController';
import { createTask, getTasksByUserId, getTaskById, updateTask, deleteTask } from '../controllers/taskController';
import { loginValidationRules, handleValidationErrors } from '../Middleware/validation';
import { isAuthenticated } from '../Middleware/auth';


const router = Router();


router.post('/login', loginValidationRules, handleValidationErrors, loginUser);
router.get('/profile', isAuthenticated, profile);
router.post('/token/v1/generate', isAuthenticated, generateToken);

//task apis
router.post('/tasks', isAuthenticated, createTask);
router.get('/tasks/user/:userId', isAuthenticated, getTasksByUserId);
router.get('/tasks/:id', isAuthenticated, getTaskById);
router.put('/tasks/:id', isAuthenticated, updateTask);
router.delete('/tasks/:id', isAuthenticated, deleteTask);


export default router;
