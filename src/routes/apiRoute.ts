import { Router } from 'express';
import { loginUser, profile, generateToken } from '../controllers/userController';
import { saveTask, getTasksByUserId, getTaskById, updateTask, deleteTask, getTasks } from '../controllers/taskController';
import { loginValidationRules, handleValidationErrors } from '../Middleware/validation';
import { isAuthenticated } from '../Middleware/auth';


const router = Router();


router.post('/login', loginValidationRules, handleValidationErrors, loginUser);
router.get('/profile', isAuthenticated, profile);
router.post('/token/v1/generate', isAuthenticated, generateToken);

//task apis
router.post('/tasks/v1', isAuthenticated, saveTask);
router.get('/tasks/v1/user/:userId', isAuthenticated, getTasksByUserId);
router.get('/tasks/v1/:id', isAuthenticated, getTaskById);
router.put('/tasks/v1/:id', isAuthenticated, updateTask);
router.delete('/tasks/v1/:id', isAuthenticated, deleteTask);
router.get('/tasks/v1', isAuthenticated, getTasks);


export default router;
