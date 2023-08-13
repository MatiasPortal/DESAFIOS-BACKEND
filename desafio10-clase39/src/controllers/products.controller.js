import CustomError from "../dao/services/customErrors.js";
import ProductsDB from "../dao/services/products.dbclass.js";
import errorsDict from "../configs/dictionary.errors.js";
import { generateProduct } from "../configs/faker.js";

const product = new ProductsDB();

// Obtener productos.
export const getProducts = async (req, res, next) => {
    const {limit, page, sort, category, status} = req.query;

    try {
        let products = await product.getProducts(limit, page, sort, category, status);

        if(!products) {
            throw new CustomError(errorsDict.VALIDATION_ERROR);
        }

        res.status(200).send({ status: "success", products });
    
    } catch(err) {
        next(err);
    }   
};

// Agregar producto.
export const addProducts = async (req, res, next) => {
    try {
        let productToAdd = await req.body;
        const data = await product.addProduct(productToAdd);

        if(!data) {
            throw new CustomError(errorsDict.VALIDATION_ERROR);
        }

        if(data.status === "error") {
            return res.status(404).send({ data });
        }
        res.status(200).send({ status: "success", productToAdd })
    } catch(err){
        next(err)
    }
};

// Obtener producto por id.
export const getById = async (req, res, next) => {
    try {
        const pid = req.params.pid;
        const productId = await product.getProductById(pid);


        if(!productId) {
            throw new CustomError(errorsDict.NOT_FOUND_ERROR);
        }

        res.status(200).send({ status: "success", productId });

    } catch(err) {
        next(err)
    }
};

// Update de producto.
export const updateProduct = async (req, res, next) => {
    try{
        let data = await product.updateProduct(req.params.pid, req.body);

        if(!data) {
            throw new CustomError(errorsDict.VALIDATION_ERROR);
        }

        res.status(200).send({ status: "success", data })
    } catch(err) {
        next(err);
    }
};

// Eliminar producto.
export const deleteProduct = async (req, res, next) => {
    try {
        const pid = req.params.pid;
        const productToDelete = await product.getProductById(pid);

        if(productToDelete) {
            const productOwner = JSON.parse(JSON.stringify(productToDelete.owner));
            console.log(productOwner);
            const userId = req.user.id;
            console.log(userId);

            if ((req.user.role === "premium" && productOwner === userId) || req.user.role === "admin") {
                await product.deleteProduct(pid);
                return res.status(200).send("Producto eliminado");
            } else {
                res.status(403).send("No se pudo borrar este producto.");
            }
        } else {
            return res.status(404).send(errorsDict.NOT_FOUND_ERROR);
        }

    } catch(err) {
        next(err);
    }
};

// generar producto mock.
export const mockingProducts = async (req, res) => {
    try {
        let products = [];

        for (let i = 0; i < 100; i++) {
            let product = generateProduct();
            products.push(product);
        }
        
        res.send({ status: "success", payload: products })
        
    } catch(err) {
        res.status(500).send(err);
    }   
};


