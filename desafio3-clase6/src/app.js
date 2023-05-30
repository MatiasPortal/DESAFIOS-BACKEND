const ProductManager = require("./productManager");
const express = require("express");

const PUERTO = 8080;
const app = express();

const productManager = new ProductManager("./products.txt");

//DEVOLVER LIMITE DE PRODUCTOS SOLICITADOS.
app.get("/products", async (req, res) => {
    const products = await productManager.getProducts();
    const limit = req.query.limit;

    if(limit) { 
        res.json( products.slice(0, limit) )
    } else {
        res.json( products ); //localhost:8080/products?limit=2
    }
});

//DEVOLVER PRODUCTO CON ID SOLICITADO.
app.get("/products/:pid", async(req, res) => {
    const pid = req.params.pid;
    const products = await productManager.getProducts();
    const productId = products.find((prod) => prod.id == pid);

    res.send( productId ); //localhost:8080/products/2
})


app.listen(PUERTO, () => {
    console.log(`Servidor activo en puerto ${PUERTO}`)
})
