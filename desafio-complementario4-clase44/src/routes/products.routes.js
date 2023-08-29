import { addProducts, deleteProduct, getById, getProducts, mockingProducts, updatedProduct } from "../controllers/products.controller.js";
import { validate, validateAdmin, validatePremium } from "../middlewares/validate.middleware.js";

import { Router } from "express";

const routerProducts = Router();


//GET - Obtener productos.
routerProducts.get("/products", /* validateAdmin, */ getProducts);

//GET - Obtener producto por ID.
routerProducts.get("/products/:pid" /* validateAdmin */, getById);

//POST - Agregar producto.
routerProducts.post("/products" /* validateAdmin */, addProducts);

//PUT - Update de producto.
routerProducts.put("/products/:pid" /* validateAdmin */, updatedProduct);

//DELETE - Eliminar producto.
routerProducts.delete("/products/:pid", /* validateAdmin , validatePremium, */  deleteProduct);


export default routerProducts;

