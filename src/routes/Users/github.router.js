import { Router } from 'express';

import passport from 'passport';
import { generateToken } from '../../utils.js';


const router = Router();


//logueo con github
router.get("/", passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {})

router.get("/githubcallback", passport.authenticate('github', {failureRedirect: '/github/error'}), async (req, res) => {
    const user = req.user;
    const tokenUser = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: user.role,
    };
    console.log(tokenUser);
    
    const accessToken = generateToken(tokenUser)
    console.log("AccesToken: " + accessToken);
    res.cookie('jwtCookieToken', accessToken, {
        maxAge: 60000,  
        httpOnly: true,
    })

    res.redirect('/users');
})


router.get('/error', (req, res) => {
    res.render('error', {error: "No se pudo autenticar el usuario usando GitHub"})
});

router.get("/fail-register", (req, res) => {
    res.status(401).send({ status: "error", message: "Error al registrar el usuario" })
})
router.get("/fail-login", (req, res) => {
    res.status(401).send({ status: "error", message: "Error al loguear el usuario" })
})

export default router;