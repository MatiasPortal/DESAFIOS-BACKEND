import mongoose from 'mongoose';
import productModel from "../models/products.model.js";

class ProductsDB {
    static productId = 0;

    constructor() {
        this.products = [];
    }

    //devolver los productos.
    getProducts = async() => {    
            const products = await productModel.find().lean();
            return products;
    }

    //agregar los productos.
    addProduct = async (product) => {
        try {
            const productsFile = await this.getProducts() // leo mis productos
            let codProd = productsFile.find((prod) => prod.code === product.code);
            let prodId = 0;

            if (productsFile.length === 0) {
                prodId = 1; 
            } else {
                prodId = productsFile[productsFile.length - 1].id + 1;
            }

            if (
                !product.title || // Verifico que ningun campo este vacio
                !product.description ||
                !product.price ||
                !product.stock ||
                !product.code ||
                !product.category
            )
            return { status: "error", message: "Todos los campos son requeridos!" };

            if (product.thumbnail === undefined) {
                product.thumbnail = [];
            }
            if (product.status === undefined) {
                product.status = true;
            }

            if (codProd) return { status: "error", message: "Code repetido!" };

            const prodToAdd = ({ id: prodId, ...product }); 
            await productModel.create(prodToAdd);
            
            console.log(`Se agregó el producto "${product.title}"`);
            
        } catch (error) {
            return error;
        }
    };

    //buscar producto con id específico.
    getProductById = async (id) => {
        try {
            return await productModel.findById({ '_id': new mongoose.Types.ObjectId(id) });
        }  catch(err) {
            return err;
        }      
    };


    updateProduct = async(id, object) => {
        try {
            await productModel.findByIdAndUpdate({ '_id': new mongoose.Types.ObjectId(id) }, object)
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