import { validate, validateAdmin } from "../middlewares/validate.middleware.js";

import CartsClassDB from "../dao/managerDB/carts.dbclass.js";
import ProductsDB from "../dao/managerDB/products.dbclass.js";
import { Router } from "express";
import productModel from "../dao/models/products.model.js";

const routerViews = Router();


const productManager = new ProductsDB()
const cartManager = new CartsClassDB()



//DETALLE DE PRODUCTO
routerViews.get("/products/:pid", validate, async (req, res) => {
    let pid = req.params.pid;
    const product = await productManager.getProductById(pid);

    res.render("productDetails", {product})
})


//REALTIMEPRODUCTS
routerViews.get('/realtimeproducts', validateAdmin, async (req, res) => {
    const currentProducts = await productModel.find().lean()
    res.render('realTimeProducts', { products: currentProducts });
});


//CARTS
routerViews.get("/carts/:cid", validate, async (req, res) => {
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
routerViews.get("/register", async (req, res) => {
    if(req.session.userValidated === true ) {
        res.redirect("/")
    } else {
        res.render("register", { errorMessages: req.session.errorMessages })
    }
});


//PERFIL
routerViews.get("/profile", validate, async (req, res) => {
    //datos de usuario.
    const user = req.session.user;
    res.render("profile", {user: user})
})

export default routerViews;
