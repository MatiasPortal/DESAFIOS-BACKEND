import mongoose from 'mongoose';
import productModel from "../models/products.model.js";

class ProductsDB {
    static productId = 0;

    constructor() {
        this.products = [];
    }

    //devolver los productos con paginate.
    getProducts = async(limit, page, sort, category, status) => {    
        let data = {
            limit: limit || 10,
            page: page || 1,
            sort: sort==="asc" ? { price: 1 } : "" || sort==="desc" ? { price: -1 } : "",
            lean: true
        }

        let query = {}

        if(category) {
            query.category = category;
        }

        if(status) {
            query.status = status;
        }

        try {
            let products = await productModel.paginate(query, data);
            let prevLink = `http://localhost:8000/?page=${products.prevPage}&limit=${products.limit}&sort=${sort}` || null
            let nextLink = `http://localhost:8000/?page=${products.nextPage}&limit=${products.limit}&sort=${sort}` || null

            const productFind = () => {
                if(Boolean(products.docs)) {
                    return "success";
                } else {
                    return "error";
                }
            }
    
            return {
                status: productFind(),
                payload: products.docs,
                totalDocs: products.totalDocs,
                limit: products.limit,
                totalPages: products.totalPages,
                page: products.page,
                pagingCounter: products.pagingCounter,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: prevLink,
                nextLink: nextLink
            }
        } catch (err) {
            return err;
        }
    }

    //agregar los productos.
    addProduct = async (product) => {
        try {
            const newProduct = await productModel.create(product);
            await newProduct.save();
            return newProduct;
        } catch (error) {
            return error;
        }
    };

    //buscar producto con id específico.
    getProductById = async (id) => {
        try {
            return await productModel.findById({ '_id': new mongoose.Types.ObjectId(id) }).lean();
        }  catch(err) {
            return err;
        }      
    };


    updateProduct = async(id, data) => {
        try {
            return await productModel.findByIdAndUpdate({ '_id': new mongoose.Types.ObjectId(id)}, data);
            
        } catch(err) {
            return err;
        }
    }

    deleteProduct = async(id) => {
        try {
            const data = await productModel.deleteOne({ '_id': new mongoose.Types.ObjectId(id) });
            data.deletedCount === 0 ? console.log("El id no existe") : console.log("Producto eliminado")
        } catch(err) {
            return err;
        }
    }
}


export default ProductsDB;