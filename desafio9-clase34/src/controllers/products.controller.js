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

        res.status(200).send(products);
    
    } catch(err) {
        next(err);
    }   
};

// Agregar producto.
export const addProducts = async (req, res, next) => {
    try {
        let product = await req.body;
        const data = await product.addProduct(product);

        if(!data) {
            throw new CustomError(errorsDict.VALIDATION_ERROR);
        }

        if(data.status === "error") {
            return res.status(404).send({ data });
        }
        res.status(200).send({ status: "success", product })
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

        res.status(200).send(productId);

    } catch(err) {
        next(err)
    }
};

// Update de producto.
export const updateProduct = async (req, res, next) => {
    try{
        let product = await product.updateProduct(req.params.pid, req.body);

        if(!product) {
            throw new CustomError(errorsDict.VALIDATION_ERROR);
        }

        res.status(200).send({ status: "success", product })
    } catch(err) {
        next(err);
    }
};

// Eliminar producto.
export const deleteProduct = async (req, res, next) => {
    try {
        const pid = req.params.pid;
        const deletedProd = await product.deleteProduct(pid);

        if(!deletedProd) {
            throw new CustomError(errorsDict.VALIDATION_ERROR);
        }


        res.status(200).send("Producto eliminado", deletedProd);
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


