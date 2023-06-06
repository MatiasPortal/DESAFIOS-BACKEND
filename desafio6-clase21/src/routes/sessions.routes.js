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
    
    return routes;
}

export default sessionRoutes