import cartModel from "../models/carts.model.js";
import mongoose from 'mongoose';

class CartsClassDB {
    constructor() {
    }

    // Obtener los carritos con populate.
    getCarts = async() => {
        try {
            const data = await cartModel.find().lean().populate('products.product');
            return data;
        } catch(err) {
            return  err;
        }
    }

    // Obtener carrito por id con populate.
    getCartById = async(cartId) => {
        try {
            return await cartModel.findById({ '_id': new mongoose.Types.ObjectId(cartId) }).lean().populate('products.product');
        }catch(err) {
            console.log(err)
        }
    }

    // Generar un nuevo carrito.
    addCart = async() => {
        try {
            const newCart = new cartModel();
            await newCart.save();
            return newCart;
        } catch(err) {
            return  err;
        }
    }

    // Eliminar carrito.
    deleteCart = async(cartId) => {
        try {
            const newData = await cartModel.deleteOne({ _id: cartId });
            return newData;
        } catch(err) {
            return err;
        }
    }

    // Agregar producto al carrito.
    addProductToCart = async(cartId, productId) => {
        try {
            let cart = await cartModel.findOne({ '_id': new mongoose.Types.ObjectId(cartId) });
            let productsInCart = cart.products;
            let index = productsInCart.findIndex((p) => p.product._id == productId );
            let obj = productsInCart[index]

            if(index >= 0) {
                obj.quantity++
                productsInCart[index] = obj
                let result = await cartModel.findByIdAndUpdate({ '_id': new mongoose.Types.ObjectId(cartId) }, { products: productsInCart });
                return result;

            } else {
                let newObj = {
                    product: productId,
                    quantity: 1
                };
                
                let result = await cartModel.findByIdAndUpdate({ '_id': new mongoose.Types.ObjectId(cartId) }, {$push:{"products":newObj}});
                return result;
            }
        } catch(err) {
            return err;
        }
    }

    // Eliminar producto del carrito.
    deleteProductInCart = async (cartId, productId) => {
        try {   
            let cart = await cartModel.findOne({ '_id': new mongoose.Types.ObjectId(cartId) });
            let productsInCart = cart.products;
            //Obtengo el indice del producto a eliminar.
            let index = productsInCart.findIndex((p) => p.product._id == productId );

            if(index >= 0) {
                //Crear nuevo array sin el producto.
                let newArray = productsInCart.filter((p) => p.product._id != productId );
                //Actualizar el array en la base de datos.
                let result = await cartModel.findByIdAndUpdate({ '_id': new mongoose.Types.ObjectId(cartId) }, { products: newArray });
                return result;
            }
        } catch(err) {
            return err;
        }
    }

    // Update de cantidad del carrito.
    updateProductQuantity = async (cartId, ProductId, quantity) => {
        try {
            await cartModel.updateOne({ _id: cartId,  "products._id": ProductId }, { $set: { "products.$.quantity": quantity } });
        } catch(err) {
            return err;
        }
    }

    // Eliminar todos los productos del carrito.
    deleteAllProducts = async (cartId) => {
        try {
            await cartModel.updateOne({ _id: cartId }, { $set: { products: [] } });
        } catch(err) {
            return err;
        }
    }
}

export default CartsClassDB;