import { Router } from "express";
import { validateAdmin } from "../middlewares/validate.middleware.js";
import { getProducts, addProducts, getById, updateProduct, deleteProduct } from "../controllers/products.controller.js";

const routerProducts = Router();


//GET - Obtener productos.
routerProducts.get("/products", validateAdmin, getProducts);

//GET - Obtener producto por ID.
routerProducts.get("/products/:pid", validateAdmin, getById);

//POST - Agregar producto.
routerProducts.post("/products", validateAdmin, addProducts);

//PUT - Update de producto.
routerProducts.put("/products/:pid", validateAdmin, updateProduct);

//DELETE - Eliminar producto.
routerProducts.delete("/products/:pid", validateAdmin, deleteProduct);


export default routerProducts;