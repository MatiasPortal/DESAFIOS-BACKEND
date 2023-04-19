const express = require("express");
const  CartManager  = require("../fileSystem/cartManager");
const ProductManager = require("../fileSystem/productManager");

const routerCart = express.Router();

const path = "./db/carts.json";
const manager =  new CartManager(path);

const pathProducts = "./db/products.json";
const managerProducts = new ProductManager(pathProducts);


//POST - Crear carrito.
routerCart.post("/carts", async(req, res) => {
    try {
        let data = await manager.getCarts();
        let cartId = data.length + 1;///obtengo el ultimo id y le sumo 1

        manager.addCart({ id: cartId, products: [] });//creo el carrito

        res.status(200).send({ status:  "ok",  message: "Carrito creado"  });
        
    } catch(err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});


//GET - Listar productos del carrito por id.
routerCart.get("/carts/:cid", async(req, res) => {
    try {
        let cart = await manager.getCartById(parseInt(req.params.cid));//obtengo el carrito por id.
        
        if(cart) {
            res.status(200).send({ status: "ok", cart: cart });
        } else {
            res.status(404).send({ status: "error", message: "Carrito no encontrado" });
        }
        
    } catch(err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});


routerCart.post("/carts/:cid/product/:pid", async(req, res) => {
    try {
        const { cid, pid } = req.params;

        if(!parseInt(cid) && parseInt(cid) !== 0) {
            res.status(400).send({ status: "error", message: "El id del carrito es invalido" });
        }
        if(!parseInt(pid) && parseInt(pid) !== 0) {
            res.status(400).send({ status: "error", message: "El id del producto es invalido" });
        }

        let cart = await manager.getCartById(parseInt(cid));//obtengo el carrito por id.
        if(!cart) {
            res.status(404).send({ status: "error", message: "Carrito no encontrado" });
        }

        let product = await managerProducts.getProductById(parseInt(pid));//obtengo el producto por id.
        if(!product) {
            res.status(404).send({ status: "error", message: "Producto no encontrado" });
        }
        
        manager.addProductToCart(parseInt(cid), parseInt(pid));//agrego el producto al carrito.;
        res.send({ status: "ok", message: "Producto agregado al carrito" });

    } catch(err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});  


module.exports = routerCart;