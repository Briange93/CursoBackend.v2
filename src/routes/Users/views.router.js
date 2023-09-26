import {Router} from 'express';
import cookieParser from 'cookie-parser';

const router = Router();

//router.use(cookieParser());
router.use(cookieParser("CoderS3cr3tC0d3"));

router.get('/',(req,res)=>{ 
    res.render('index',{})
});

//Set a cookie:
router.get('/setCookie', (req, res) => {
    res.cookie("MiCookie", "Esta es la cookie de mi proyecto back end", {maxAge: 60000, signed: true}).send("Exito seteando la cookie");
});

//Get a cookie:
router.get('/getCookie', (req, res) => {
    res.send(req.signedCookies);
})

//Delete a cookie:
router.get('/deleteCookie', (req, res) => {
    res.clearCookie("MiCookie").send("Cookie eliminada");
})



//Session management:
router.get("/session", (req, res) => {
    if (req.session) {
        if (req.session.counter) {
            req.session.counter++;
            res.send(`Se ha visitado este sitio ${req.session.counter} veces.`);
        } else {
            console.log(req.session);
            req.session.counter = 1;
            res.send("Bienvenido!");
        }
    } else {
        console.error("req.session no está definido");
        res.status(500).send("Error en la sesión");
    }
});



//Auth middleware:
function auth(req, res, next){
    if (req.user.role === "admin") {
        return next();
    } else{
        return res.status(403).send("Usuario no autorizado para ingresar a este recurso.");
    }
    
}

router.get('/private', auth, (req, res) =>{
    res.send("Si estas viendo esto es porque pasaste la autorización a este recurso!");
});

export default router;