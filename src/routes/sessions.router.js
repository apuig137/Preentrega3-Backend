import { Router } from 'express';
import passport from 'passport';
import { register, failRegister, login, failLogin, logout, githubCallback, successRegister, current, sendEmail } from "../controllers/sessions.controller.js"

const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: 'http://localhost:8080/api/sessions/failregister', successRedirect: 'http://localhost:8080/api/sessions/successRegister' }), register)

router.get('/failregister', failRegister);

router.get('/successregister', successRegister);

router.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/faillogin'}), login)

router.get('/faillogin', failLogin);

router.get('/logout', logout)

router.get('/current', current)

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { });

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: 'api/sessions/login' }), githubCallback);

router.get("/sendrecovermail/:email", sendEmail)

export default router;