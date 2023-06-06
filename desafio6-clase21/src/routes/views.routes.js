import { authToken, generateToken } from "../utils.js";
import { validate, validateAdmin } from "../middlewares/validate.middleware.js";

import CartsClassDB from "../dao/managerDB/carts.dbclass.js";
import ProductsDB from "../dao/managerDB/products.dbclass.js";
import { Router } from "express";
import passport from "passport";
import productModel from "../dao/models/products.model.js";

const productManager = new ProductsDB()
const cartManager = new CartsClassDB()



const routerViews = (store, EMAIL_ADMIN, PASS_ADMIN) => {
    const router = Router();

    //DETALLE DE PRODUCTO
    router.get("/products/:pid", validate, async (req, res) => {
        let pid = req.params.pid;
        const product = await productManager.getProductById(pid);

        res.render("productDetails", {product})
    })


    //REALTIMEPRODUCTS
    router.get('/realtimeproducts', validateAdmin, async (req, res) => {
        const currentProducts = await productModel.find().lean()
        res.render('realTimeProducts', { products: currentProducts });
    });


    //CARTS
    router.get("/carts/:cid", validate, async (req, res) => {
        try {
            let cid = req.params.cid;
            let cart = await cartManager.getCartById(cid);
            let productsInCart = cart.products;
            console.log(cart);

            res.render("carts", {productsInCart})
        } catch(err) {
            res.status(400).json(err.message)
        }
    });

    //REGISTRO
    router.get("/register", async (req, res) => {
        if(req.session.userValidated === true ) {
            res.redirect("/")
        } else {
            res.render("register", { errorMessages: req.session.errorMessages })
        }
    });


    //PERFIL
    router.get("/profile", validate, async (req, res) => {
        //datos de usuario.
        const user = req.session.user;
        res.render("profile", {user: user})
    });


    //SESION

    //verificar los datos de sesion.
    router.get("/", async (req, res) => {
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
    router.get("/logout", (req, res) => {
        req.session.userValidated = false;

        req.session.destroy((err) => {
            req.sessionStore.destroy(req.sessionID, (err) => {
                if (err) console.log(`Error al cerrar sesion: ${err}`);

                console.log("Sesion cerrada");
                res.redirect("/");
            });
        })
    });

    //login error.
    router.get("/failedLogin", (req, res) => {
        res.render("failedLogin", { errorMessages: req.session.errorMessages })
    })

    //login.
    router.post("/login", passport.authenticate("login", { failureRedirect: "/failedLogin" }), async(req, res) => {
        if(!req.user) {
            req.session.userValidated = false;
            return res.status(401).send("Usuario no encontrado");
        }

        req.session.userValidated = true;
        // DATOS DE USUARIO
        req.session.user = {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role,
            id: req.user._id
        };

        //GENERAR TOKEN
        const accessToken = generateToken(req.user);
        console.log(accessToken)
        res.cookie("accessToken", accessToken, { httpOnly: true });
        
        res.redirect("/");

        //LOGIN DE ADMIN.
        if(req.user.email === EMAIL_ADMIN && req.user.password === PASS_ADMIN) {
            req.session.userValidated = true;
            req.session.user = {
                firstName: "Admin",
                lastName: "Coder",
                email: EMAIL_ADMIN,
                role: "admin"
            }
            res.redirect("/"); 
        }  
    });

    
    router.get("/current", authToken, (req, res) => {
        res.send({ status: "success", payload: req.user })
    });

    //error al registrar.
    router.get("/failedRegister", (req, res) => {
        res.render("failedRegister", {})
    });

    //registrar usuario.
    router.post("/register", passport.authenticate("register", {successRedirect: "/", failureRedirect: "/failedRegister", failureFlash: true }), async (req, res) => {
        res.send({ status: "OK", message: "Usuario registrado correctamente"});
    });

    return router;
}


export default routerViews;
