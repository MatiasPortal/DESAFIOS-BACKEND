import { createHash, validPassword } from "../utils.js";

import ProductsDB from "../dao/managerDB/products.dbclass.js";
import { Router } from "express"
import UsersDB from "../dao/managerDB/users.dbclass.js";
import bcrypt from "bcrypt";
import userModel from "../dao/models/users.model.js";

const users = new UsersDB();
const productManager = new ProductsDB();


const loginRoutes = (store, EMAIL_ADMIN, PASS_ADMIN) => {
    const routes = Router();

    //verificar los datos de sesion.
    routes.get("/", async (req, res) => {
        store.get(req.sessionID, async (err, data) => {
            //si hay un error
            if (err) console.log(`Error al obtener el usuario: ${err}`)

            //si la validacion de usuario es true se renderiza la vista de productos.
            if (data !== null && (req.session.userValidated)) {      
                  
                let limit = parseInt(req.query.limit) || 10;
                let category = req.query.category || "";
                let sort = req.query.sort?.toString() || "";
                let page = parseInt(req.query.page) || 1;
                let status = req.query.status || "";

                const products = await productManager.getProducts(limit, page, sort, category, status);
                
                //datos de usuario.
                const user = req.session.user;

                res.status(200).render("home", { products: products, user: user })


            } else {
                //si la validacion de usuario es false se renderiza la vista de login.
                res.render("login", { sessionInfo: data, errorMessages: req.session.errorMessages  })
            }
        })
    });

    //cerrar sesion.
    routes.get("/logout", (req, res) => {
        req.session.userValidated = false;

        req.session.destroy((err) => {
            req.sessionStore.destroy(req.sessionID, (err) => {
                if (err) console.log(`Error al cerrar sesion: ${err}`);

                console.log("Sesion cerrada");
                res.redirect("/");
            });
        })
    });

    //login.
    routes.post("/login", async(req, res) => {
        const {  email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (user) {
            //Validar usuario
            if (validPassword(password, user)) {
                req.session.userValidated = true;
                req.session.user = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    age: user.age,
                    role: user.role,
                    id: user._id
                }
            } else {
                req.session.userValidated = false;
                req.session.errorMessages = "El usuario o contraseña son incorrectos";
            }
            res.redirect("/");   
        }
        
        //LOGIN DE ADMIN.
        if(email === EMAIL_ADMIN && password === PASS_ADMIN) {
            req.session.userValidated = true;
            req.session.user = {
                firstName: "Admin",
                lastName: "Coder",
                email: EMAIL_ADMIN,
                role: "admin"
            }
            res.redirect("/"); 
        }  
    })

    //registrar usuario.
    routes.post("/register", async (req, res) => {
        const { firstName, lastName, email, age, password } = req.body;
        const exist = await userModel.findOne({ email });

        try {
            if(exist) {
                return res.status(400).send("El email esta en uso.")
            }
            
            const user = {
                firstName,
                lastName,
                email,
                age,
                password: createHash(password),
            };

            const data = await userModel.create(user);
    
            res.redirect("/");

        } catch(err) {
            return err;
        }
    })

    return routes;
}

export default loginRoutes