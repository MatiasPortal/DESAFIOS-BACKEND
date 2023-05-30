import  ProductManager  from "../fileSystem/productManager.js";
import { Router } from "express";

const routerProducts = Router();

const productManager = new ProductManager("./db/products.json");

//GET - Obtener productos.
routerProducts.get("/products", async (req, res) => {
    const products = await productManager.getProducts();
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
        const products = await productManager.getProducts();
        const productId = products.find((prod) => prod.id == pid);

        res.send( productId );
    } catch(err) {
        res.status(400).send(err);
    }
});


//POST - Agregar producto.
routerProducts.post("/products", async (req, res) => {
    try {
        let product = await req.body;
        let data = await productManager.addProduct(product);
        console.log(data);

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
        const { pid } = req.params;

        if(!parseInt(pid) && parseInt(pid) !== 0)
        return res.status(400).send({ status: "error", message: "El ID debe ser un número" });

        let data = await productManager.getProducts();//Obtengo todos los productos
        let product = await productManager.getProductById(parseInt(pid));//Obtengo el producto por ID.

        if(!product) {
            return res.status(404).send({ status: "error", message: "Producto no encontrado" });//Si no existe el producto por id.
        }

        let productUpdate = req.body;//Obtengo el producto a actualizar.
        let codProd = undefined;

        //Valido que el cádigo no exista.
        if(productUpdate.code !== product.code) {
            codProd = data.find(prod => prod.code === productUpdate.code);
        }

        if(codProd) {
            return res.status(400).send({ status: "error", message: `El cádigo ${productUpdate.code} ya existe` });
        }

        productManager.updateProduct(parseInt(pid), productUpdate);//Actualizo el producto.
        res.status(200).send({ status: "success", message: "Producto actualizado" })
        
    } catch(err) {
        res.status(500).send(err);
    }
});


//DELETE - Eliminar producto.
routerProducts.delete("/products/:pid", async (req, res) => {
    const pid = req.params.pid;
    await productManager.deleteProduct(pid);

    res.status(200).send("Producto eliminado");

});


export default routerProducts;