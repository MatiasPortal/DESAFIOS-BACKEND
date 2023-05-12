import  ProductsDB from "../dao/managerDB/products.dbclass.js";
import { Router } from "express";

const routerProducts = Router();

const managerDB = new ProductsDB();

//GET - Obtener productos.
routerProducts.get("/products", async (req, res) => {
    const products = await managerDB.getProducts();
    const limit = req.query.limit;

    if(limit) { 
        res.status(200).json( products.slice(0, limit) )
    } else {
        res.status(200).json( products ); 
    }
});


//GET - Obtener producto por ID.
routerProducts.get("/products/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const products = await managerDB.getProducts();
        const productId = products.find((prod) => prod.id == pid);

        res.status(200).send( productId );
    } catch(err) {
        res.status(400).send(err);
    }
});


//POST - Agregar producto.
routerProducts.post("/products", async (req, res) => {
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
routerProducts.put("/products/:pid", async (req, res) => {
    try{
        let product = await managerDB.updateProduct(req.params.pid, req.body);
        res.status(200).send({ status: "success", product })
    } catch(err) {
        res.status(500).send(err);
    }
});



//DELETE - Eliminar producto.
routerProducts.delete("/products/:pid", async (req, res) => {
    const pid = req.params.pid;
    await managerDB.deleteProduct(pid);

    res.status(200).send("Producto eliminado");

});


export default routerProducts;