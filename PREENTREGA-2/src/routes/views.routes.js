import CartsClassDB from "../dao/managerDB/carts.dbclass.js";
import ProductsDB from "../dao/managerDB/products.dbclass.js";
import { Router } from "express";
import productModel from "../dao/models/products.model.js";

const routerViews = Router();


const productManager = new ProductsDB()
const cartManager = new CartsClassDB()


routerViews.get('/products', async (req, res) => {
    try {
        let limit = parseInt(req.query.limit) || 10;
        let category = req.query.category || "";
        let sort = req.query.sort?.toString() || "";
        let page = parseInt(req.query.page) || 1;
        let status = req.query.status || "";

        const products = await productManager.getProducts(limit, page, sort, category, status);      
       
        res.render("home", { products: products })
    } catch (error) {
        console.log(error)
        res.status(400).json(error.message)
    }
});


routerViews.get('/realtimeproducts', async (req, res) => {
    const currentProducts = await productModel.find().lean()
    res.render('realTimeProducts', { products: currentProducts });
});


routerViews.get("/carts/:cid", async (req, res) => {
    try {
        let cid = req.params.cid;
        let cart = await cartManager.getCartById(cid);
        let productsInCart = cart.products;
        console.log(cart);

        res.render("carts", {productsInCart})
    } catch(err) {
        res.status(400).json(err.message)
    }
})



routerViews.get("/products/:pid", async (req, res) => {
    let pid = req.params.pid;
    const product = await productManager.getProductById(pid);

    res.render("productDetails", {product})
})

export default routerViews;
