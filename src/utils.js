import {fileURLToPath} from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// Encriptacion
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

//administracion archivos locales
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);


//Configuracion de Multer para subir archivos
import multer from 'multer'
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, `${__dirname}/public/img`)},

        filename: function(req, file, cb) {
            cb(null, file.originalname)
        }
    });    
export const uploader = multer({storage, onError: function(err, next) {
    console.log(err);
    next();
    }
});

//Config JWT
export const PRIVATE_KEY = 'ProyectoCoderHouseBackEndSecretKeyJWT';

export const generateToken = (user) => {
    return jwt.sign({user}, PRIVATE_KEY, {expiresIn: '60s'})
};

export const authToken = (req, res, next) => {
    //el JWT de autorizacion se guarda en el header de la peticion
    const authHeader = req.headers.authorization;
    if (!authHeader){ 
        return res.status(401).send({error: 'User not authenticated or missing token'})
    };
    const token = authHeader.split(' ')[1]; // se hace el split para retirar la palabra Bearer y quedarnos solo con el token
    //validar token
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error) return res.status(403).send({error: 'Invalid token, access denied'});
        //token ok
        req.user = credentials.user;
        next();
    });
};;

