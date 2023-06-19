import  CartsClassDB  from "../dao/managerDB/carts.dbclass.js";
import  ProductsDB from "../dao/managerDB/products.dbclass.js";
import { Router } from "express";
import { validateAdmin } from "../middlewares/validate.middleware.js";

const routerCart = Router();

const manager =  new CartsClassDB();
const managerProducts = new ProductsDB();


//POST - Crear carrito.
routerCart.post("/carts", validateAdmin, async(req, res) => {
    try {
        const data = await manager.addCart();
        res.status(200).send({ status:  "ok",  message: `Carrito creado`, data  });
        
    } catch(err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

// GET - Listar todos los carritos.
routerCart.get("/carts", validateAdmin, async(req, res) => {
    try {
        const carts = await manager.getCarts()
        res.status(200).send({ status: "ok", carts })
    } catch(err) {
        res.status(500).send({ status: "error", message: err.message })
    }
})

//POST - Agregar producto al carrito.
routerCart.post("/carts/:cid/product/:pid", validateAdmin,  async(req, res) => {
    try {
        const { cid, pid } = req.params;
  
        manager.addProductToCart(cid, pid);//agrego el producto al carrito.;
        res.status(200).send({ status: "ok", message: "Producto agregado al carrito" });

    } catch(err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});  

//DELETE - Borrar carrito.
routerCart.delete("/cartdelete/:cid", validateAdmin,  async(req, res) => {
    const { cid } = req.params;

    try {
        const data = await manager.deleteCart(cid);
        res.status(200).send({ status: "ok", message: "Carrito eliminado", data });

    } catch(err) {
        res.status(500).send({ status: "error", message: err.message })
    }
});

//DELETE - Borrar producto del carrito.
routerCart.delete("/carts/:cid/product/:pid", validateAdmin, async(req, res) => {
    const { cid, pid } = req.params;

    try {
        const data = await manager.deleteProductInCart(cid, pid);

        res.status(200).send({ status: "ok", message: "Producto eliminado del carrito", data });

    } catch(err) {
        res.status(500).send({ status: "error", message: err.message })
    }
});

//PUT - actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body.
routerCart.put("/carts/:cid/product/:pid", validateAdmin, async(req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const data = await manager.updateProductQuantity(cid, pid, quantity);
        res.status(200).send({ status: "ok", message: "Producto actualizado", data });

    } catch(err) {
        res.status(500).send({ status: "error", message: err.message })
    }
});

//DELETE - Borrar todos los productos del carrito.
routerCart.delete("/carts/:cid", validateAdmin, async(req, res) => {
    const { cid } = req.params;

    try{
        await manager.deleteAllProducts(cid);
        res.status(200).send({ status: "ok", message: "Productos del carrito eliminado" });   

    } catch(err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

//GET - Obtener un carrito por id.
routerCart.get("/carts/:cid", validateAdmin, async(req, res) => {
    const { cid } = req.params;

    try {
        const data = await manager.getCartById(cid);
        res.status(200).send({ message: "Carrito encontrado.", data:  data });
    } catch(err) {
        res.status(500).send({ status: "error", message: err.message });
    }
});

export default routerCart;


        