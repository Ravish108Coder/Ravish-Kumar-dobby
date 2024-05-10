import { Router } from 'express';

const router = Router()

import { loginController, logoutController, registerController } from '../controllers/user.controller.js';

router.post('/register', registerController)

router.post('/login', loginController)

router.get('/logout', logoutController)

export default router;