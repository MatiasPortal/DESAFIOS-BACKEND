import cartModel from "../models/carts.model.js";
import mongoose from 'mongoose';

class CartsClassDB {
    constructor() {
        this.carts = [];
    }

    getCarts = async() => {
        try {
            const data = await cartModel.find().lean();
            return data;
        } catch(err) {
            return  [];
        }
    }

    getCartById = async(id) => {
        try {
            return await cartModel.findById({ '_id': new mongoose.Types.ObjectId(id) });
        }catch(err) {
            console.log(err)
        }
    }

    addCart = async(cart) => {
        try {
            await this.getCarts(); //leo el archivo de carts.
            this.carts.push(cart); //agrego el cart al array de carts.
            await cartModel.create(this.carts)
            return cart;
        } catch(err) {
            return  err;
        }
    }

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
}

export default CartsClassDB;