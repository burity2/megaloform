import express from 'express'
import * as controller from './controller'
import { requireAuth, requireOwnership } from './auth-middleware'
import { loginLimiter, signupLimiter } from './rate-limit'

const router = express.Router();

router.post('/auth/signup', signupLimiter, controller.signup)
router.post('/auth/login', loginLimiter, controller.login)

router.patch('/candidates/:id/registration', requireAuth, requireOwnership, controller.register)
router.patch('/candidates/:id/test', requireAuth, requireOwnership, controller.testCandidate)
router.get('/candidates/:id', requireAuth, requireOwnership, controller.fetchCandidate)

export default router;
