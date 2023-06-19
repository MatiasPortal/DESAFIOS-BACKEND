import  ProductsDB from "../dao/managerDB/products.dbclass.js";
import { Router } from "express";
import productModel from "../dao/models/products.model.js";
import { validateAdmin } from "../middlewares/validate.middleware.js";

const routerProducts = Router();

const managerDB = new ProductsDB();



//GET - Obtener productos.
routerProducts.get("/products", validateAdmin, async (req, res) => {
    const {limit, page, sort, category, status} = req.query;

    try {
        let products = await managerDB.getProducts(limit, page, sort, category, status);
        res.status(200).send(products);
    
    } catch(err) {
        res.status(500).send(err.message);
    }
    
});


//GET - Obtener producto por ID.
routerProducts.get("/products/:pid", validateAdmin, async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = await managerDB.getProductById(pid);

        res.status(200).send( { status: "success", product });
    } catch(err) {
        res.status(400).send(err);
    }
});


//POST - Agregar producto.
routerProducts.post("/products", validateAdmin, async (req, res) => {
    try {
        let product = await req.body;
        const data = await managerDB.addProduct(product);

        if(data.status === "error") {
            return res.status(404).send({ data });
        }
        res.status(200).send({ status: "success", product })
    } catch(err){
        res.status(500).send(err)
    }
});


//PUT - Update de producto.
routerProducts.put("/products/:pid", validateAdmin, async (req, res) => {
    try{
        let product = await managerDB.updateProduct(req.params.pid, req.body);
        res.status(200).send({ status: "success", product })
    } catch(err) {
        res.status(500).send(err);
    }
});



//DELETE - Eliminar producto.
routerProducts.delete("/products/:pid", validateAdmin, async (req, res) => {
    try {
        const pid = req.params.pid;
        await managerDB.deleteProduct(pid);

        res.status(200).send("Producto eliminado");
    } catch(err) {
        res.status(500).send(err);
    }

});


export default routerProducts;