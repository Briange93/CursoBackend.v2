import { Router } from 'express';
import userModel from '../../models/userModel.js';
import { isValidPassword } from '../../utils.js';
import { generateToken } from '../../utils.js';

const router = Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                return res.status(204).send({ error: "Not Found", message: 'Usuario no encontrado' });
            }
            if (!isValidPassword(user, password)) {
                return res.status(401).send({ status:'error', error:'Los datos ingresados son incorrectos' });
            }
            const tokenUser = {
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                role: user.role,
            };
            console.log(tokenUser);
            
            const accessToken = generateToken(tokenUser);
            console.log("AccesToken: " + accessToken);

            //localStorage
            /* res.send({message :"Login exitoso", jwt: accessToken}) */

            //Cookies
            res.cookie('jwtCookieToken', accessToken, {
                maxAge: 60000,  
                httpOnly: true, // no expone la cookie cuando esta en true
            })
            res.send({message :"Login exitoso"})
            
        }catch (error) {
            return res.status(500).send({ status: 'error', message: "Error interno de la aplicacion" })
        }

})

router.get('/logout', (req, res) => {
    res.clearCookie('jwtCookieToken');
    res.send({message: "Logout exitoso"})
})

function auth(req, res, next){
    const role = req.params.role;
    console.log("el req.user del aut para ver si es admin es: ", role);
    if (role === "admin") {
        return next();
    } else{
        return res.status(403).send("Usuario no autorizado para ingresar a este recurso.");
    }
    
}

router.get('/private/:role', auth, (req, res) =>{
    res.send("Si estas viendo esto es porque pasaste la autorización a este recurso!");
});

export default router;