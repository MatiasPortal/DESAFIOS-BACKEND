import { GetUserDto } from "../dao/dto/user.dto.js";
import { Router } from "express"
import initializePassport from "../passport/passport.strategies.js";
import passport from "passport";

initializePassport()

const sessionRoutes = () => {
    const routes = Router();

    //GITHUB.
    routes.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async(req, res) => {});

    routes.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/" }), async(req, res) => {
        req.session.user = req.user;
        req.session.userValidated = true;
        /* console.log(req.session.user) */
        res.redirect("/");
    })


    //CURRENT. Datos de usuario
    routes.get("/current", (req, res) => {
        let { firstName, lastName, email, age, cart } = req.session.user;
        const user = { firstName, lastName, email, age, cart }
        res.send({ status: "ok", payload: user });
});
    
    return routes;
}

export default sessionRoutes