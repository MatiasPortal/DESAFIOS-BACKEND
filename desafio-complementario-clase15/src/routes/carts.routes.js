import  CartsClassDB  from "../dao/managerDB/carts.dbclass.js";
import  ProductsDB from "../dao/managerDB/products.dbclass.js";
import { Router } from "express";

const routerCart = Router();

const manager =  new CartsClassDB();
const managerProducts = new ProductsDB();


//POST - Crear carrito.
routerCart.post("/carts", async(req, res) => {
    try {
        let data = await manager.getCarts();
        let cartId = data.length + 1;///obtengo el ultimo id y le sumo 1

        manager.addCart({ id: cartId, products: [] });//creo el carrito

        res.status(200).send({ status:  "ok",  message: `Carrito con id: ${cartId} creado`  });
        
    } catch(err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

routerCart.get("/carts", async(req, res) => {
    try {
        const carts = await manager.getCarts()
        res.status(200).send({ status: "ok", carts })
    } catch(err) {
        res.status(500).send({ status: "error", message: err.message })
    }
})

//GET - Listar productos del carrito por id.
routerCart.get("/carts/:cid", async(req, res) => {
    try {
        let cart = await manager.getCartById(req.params.cid);//obtengo el carrito por id.
        
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
  
        manager.addProductToCart(cid, pid);//agrego el producto al carrito.;
        res.status(200).send({ status: "ok", message: "Producto agregado al carrito" });

    } catch(err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});  


export default routerCart;


        