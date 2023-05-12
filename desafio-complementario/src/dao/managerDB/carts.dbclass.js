import cartModel from "../models/carts.model.js";

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
            return await cartModel.findById(id);
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
            await this.getCarts();
            const cart = this.carts.find((cart) => cart.id === cartId); //busco en array de carts si existe el id pasado.
            const productRepeat = cart.products.findIndex((prod) => prod.product === productId);//verificar si el producto se encuntra repetido.

            if(productRepeat < 0) {
                cart.products.push({ product: productId, quantity: 1 }); //si no está repetido, agrego el producto al array de productos.
            } else {
                cart.products[productRepeat].quantity++; //si el producto está repetido, incremento la cantidad.
            }
            
            await cartModel.create(this.carts) //actualizo el array de carts.
            return "Producto añadido al carrito";
        } catch(err) {
            return err;
        }
    }
}

export default CartsClassDB;