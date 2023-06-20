import * as dotenv from 'dotenv'

import { createHash, generateToken, validPassword } from "../utils.js"

import { Strategy as GithubStrategy } from 'passport-github2';
import cartModel from '../dao/models/carts.model.js'
import local from 'passport-local';
import passport from 'passport';
import userModel from '../dao/models/users.model.js';

dotenv.config({ path:"../.env" })

const LocalStrategy = local.Strategy;

const initializePassport = () => {


    //REGISTER
    passport.use("register", new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, 
        async (req, username, password, done) => {
            const { firstName, lastName, email, age } = req.body;
            try {
                const user = await userModel.findOne({ email: username });

                if(user) {
                    console.log("El usuario ya existe")
                    return done(null, false);
                }

                const newUser = {
                    firstName,
                    lastName,
                    email,
                    age,
                    password: createHash(password)
                }

                const createdUser = await userModel.create(newUser);

                // carrito.
                const newCart = await cartModel.create({});

                // Vincular cart a user.
                createdUser.cart = newCart._id;
                await createdUser.save();

                const token = generateToken(createdUser);
                
                return done(null, createdUser);

            } catch (error) {
                return done(error);
            }
        }
    ));


    //LOGIN
    passport.use("login", new LocalStrategy({ usernameField: "email", passReqToCallback: true },
     async(req, email, password, done) => {

        try {
            const user = await userModel.findOne({ email }).populate("cart");

            if(!user) {
                req.session.errorMessages = "Usuario no encontrado"
                return done(null, false, { message: 'Usuario no encontrado' });
            }

            if(!validPassword(password, user)) {
                req.session.errorMessages = "Contraseña incorrecta"
                return done(null, false, { message: 'Contraseña incorrecta' });
            }

            return done(null, user);

        } catch (error) {
            return done(error);
        }
    }));


    //LOGIN GITHUB.
    const githubOptions = {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    };

    const githubVerify = async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile._json.email == null ? profile._json.username : null;
            const user = await userModel.findOne({ email: profile._json.email });
            console.log(user) 

            if(!user) {
                const newUser = {
                    firstName: profile._json.login,
                    email: email,
                    id: profile._json.id,
                }
                const createdUser = await userModel.create(newUser);
                done(null, createdUser)
            } else {
                done(null, user);
            }
        } catch(error) {
            return done(null, error);
        }
    };
    
    passport.use(new GithubStrategy(githubOptions, githubVerify));

    
    
    // SERIALIZE
    passport.serializeUser((user, done) => {
        done(null, user);
    })

    // DESERIALIZE
    passport.deserializeUser(async (user, done) => {
        try {
            done(null, user);
        } catch(err) {
            done(err.message)
        }
    });

}


export default initializePassport;