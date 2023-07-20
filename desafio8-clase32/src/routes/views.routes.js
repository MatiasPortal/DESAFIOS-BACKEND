import { cart, login, loginError, logout, productDetails, profile, realTimeProducts, register, registerError, verifySession } from "../controllers/views.controller.js";
import { validate, validateAdmin } from "../middlewares/validate.middleware.js";

import { Router } from "express";
import passport from "passport";

const routerViews = () => {
    const router = Router();

    //DETALLE DE PRODUCTO
    router.get("/products/:pid", validate, productDetails)

    //REALTIMEPRODUCTS
    router.get('/realtimeproducts', validateAdmin, realTimeProducts);

    //CARTS
    router.get("/carts/:cid", validate, cart);

    //REGISTRO
    router.get("/register", register);

    //PERFIL
    router.get("/profile", validate, profile);


    //SESION
    //verificar los datos de sesion.
    router.get("/", verifySession);

    //cerrar sesion.
    router.get("/logout", logout);

    //login error.
    router.get("/failedLogin", loginError)

    //login.
    router.post("/login", passport.authenticate("login", { failureRedirect: "/failedLogin" }), login);

    //error al registrar.
    router.get("/failedRegister", registerError);

    //registrar usuario.
    router.post("/register", passport.authenticate("register", {successRedirect: "/", failureRedirect: "/failedRegister", failureFlash: true }), async (req, res) => {
        res.send({ status: "OK", message: "Usuario registrado correctamente"});
    });

    return router;
}


export default routerViews;
