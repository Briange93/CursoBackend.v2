import passport from "passport";
import passportLocal from "passport-local";
import GitHubStrategy from "passport-github2";
import jwtStrategy from "passport-jwt";
import userModel from "../models/userModel.js";
import { createHash, isValidPassword, PRIVATE_KEY } from "../utils.js";
import e from "express";

//Declaramos la estrategia a utilizar
const localStrategy = passportLocal.Strategy;
const JwtStrategy = jwtStrategy.Strategy;
const ExtractJwt = jwtStrategy.ExtractJwt;

const initializePassport = () => {   
    // JWT Strategy
    passport.use('jwt', new JwtStrategy(
        //objeto de configuracion
        {  jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: PRIVATE_KEY,
        },
        async (jwt_payload, done) => {
            console.log("Entrando a passport Strategy con JWT");
            try {
                console.log("JWT obtenido por payload: ", jwt_payload )
                return done(null, jwt_payload.user);
            } catch (error) {
                console.error(error);
                return done(error);
            }
        }
    )
    )

    //LocalStrategy     
    //Register
    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email'},
        async (req, username, password, done) => {
            const { first_name, last_name, email, age} = req.body;
            try {
                const exists = await userModel.findOne({ email });
                if (exists) {
                    return res.status(400).send({ status: 'error', message: 'usuario ya existe' })
                };
                const user = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                }
                const result = await userModel.create(user);
                return done(null, result);
            } catch (error) {
                return done("Error registrando al usuario" + error);
            }
        }
        )
    )

    //Login
/*     passport.use('login', new localStrategy(
    { passReqToCallback: true, usernameField: 'email'},
        async (req, username, password, done) => {
            try {
                const user = await userModel.findOne({ email:username });
                if (!user) {
                    return done(null, false, { message: 'Usuario no encontrado' });
                };
                if (!isValidPassword(user, password)) {
                    return done(null, false, { message: 'Contraseña incorrecta' });
                };
                return done(null, user);
                                
            } catch (error) {
                return done("Error logueando al usuario" + error);
            }
        }
    )
    )  */

    //Github Strategy
    passport.use('github',new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        try {
            const user = await userModel.findOne({ email: profile._json.email});
            console.log("Usuario encontrado " + user);
            if (!user) {
                const newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    email: profile._json.email,
                    age: "",
                    password: "",
                    logedBy: "GitHub"
                    }
                const result = await userModel.create(newUser);
                return done(null, result);
            }else{
                return done(null, user);
            }

        } catch (error) {
            return done("Error registrando al usuario" + error);
        }
    
    }
    )
    )

    //funciones de serializacion y deserializacion
    passport.serializeUser((user, done) => {
        const serializedUser = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            };
        done(null, serializedUser);
    })

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            console.error("Error deserializando al usuario" + error);
        }
    })

}

const cookieExtractor=(req)=> {
    let token = null;
    console.log("entrando a cookie extractor");
    if (req && req.cookies) {
        token = req.cookies["jwtCookieToken"];
        console.log("token encontrado " + token);
    }
    return token;
}

export default initializePassport;