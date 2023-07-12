import ProductsDB from "./products.dbclass.js";
import TicketClassDB from "./tickets.dbclass.js";
import cartModel from "../models/carts.model.js";
import mongoose from 'mongoose';
import transporter from "../../configs/gmail.js";

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
            let cart = await cartModel.findByIdAndUpdate(cartId, { $pull: { products: { product: productId } } }, { new: true });

            return cart;
        } catch(err) {
            return err;
        }
    };

    // Update de cantidad del carrito.
    updateProductQuantity = async (cartId, ProductId, quantity) => {
        try {
            await cartModel.updateOne({ _id: cartId,  "products._id": ProductId }, { $set: { "products.$.quantity": quantity } });
        } catch(err) {
            return err;
        }
    };

    // Update de productos en carrito.
    updateCartProducts = async (cid, products) => {
        try {
            const cart = await cartModel.findById(cid);
            const rejectedProductsIds = products.map(product => product._id);
            const updatedProducts = cart.products.filter(product => !rejectedProductsIds.includes(product.product.toString()));
            cart.products = updatedProducts;
            await cart.save();
            return cart;
        } catch(err) {
            return err;
        }
    }

    // Eliminar todos los productos del carrito.
    deleteAllProducts = async (cartId) => {
        try {
            const cart = await cartModel.findById(cartId);
            cart.products = [];
            await cart.save();
            return cart;
        } catch(err) {
            return err;
        }
    };

    // Crear ticket del carrito.
    purchaseCart = async (cid, userEmail) => {
        try {
            const dataCart = await this.getCartById(cid);
    
            if (!dataCart) {
                throw new Error("No se encontró el carrito.");
            }
    
            //generar array de productos y de productos rechazados.
            let ticketProducts = [];
            const rejectedProducts = [];
            //precio total.
            let totalPrice = 0;
    
            const productDB = new ProductsDB();

            //obtener productos y actualizar stock.
            for (const cartProduct of dataCart.products) {
                const { product, quantity } = cartProduct;
    
                //obtener producto.
                const productData = await productDB.getProductById(product._id);
                console.log("Producto por id:", productData, "Cantidad en carrito:", quantity)
    
                //Si hay stock del producto, agregar lo solicitado a ticketProducts.
                if(productData.stock >= quantity) {
                    ticketProducts.push({
                        _id: product._id,
                        name: product.title,
                        price: product.price,
                        quantity
                    });
    
                    //obtener precio total.
                    totalPrice += productData.price * quantity;
    
                    //actualizar carrito y stock.
                    await this.deleteProductInCart(cid, product._id);

                    await productDB.updateProduct(product._id, { stock: productData.stock - quantity });
        
                } else {
                    // productos que no se pudieron comprar.
                    rejectedProducts.push({
                        _id: product._id,
                        name: product.title,
                        price: product.price,
                        quantity
                    });
                }
            }
    
            //generar ticket.
            const newTicket = {
                //codigo aleatorio.
                code: Math.floor(Math.random() * (999999 - 100000) + 100000),
                amount: totalPrice,
                purchaser: userEmail,
                products: ticketProducts
            };
   
            const ticket = new TicketClassDB();
            const createTicket = await ticket.createTicket(newTicket);

            const hasRejectedProducts = rejectedProducts.length > 0;
    
            //GENERAR MAIL DE COMPRA.
            if(createTicket) {
                try {
                    // enviar correo.
                    const mail = await transporter.sendMail({
                        from: 'Ecommerce <portalmatias4@gmail.com>',
                        to: userEmail,
                        subject: 'Compra realizada',
                        html: `<h1>PEDIDO REALIZADO CON ÉXITO</h1>
                                <h2>Productos comprados:</h2>
                                <ul>${newTicket.products.map(p => `<li>Nombre: ${p.name} - Cantidad: ${p.quantity} - Precio: ${p.price}</li>`).join('')}</ul>
                                <h2><strong>Codigo de compra: </strong>${newTicket.code}</h2>
                                <h2><strong>Monto total: </strong>${newTicket.amount}</h2>`
                    });
                    console.log(mail);
    
                } catch(err) {
                    console.log(err);
                }

                //actualizar carrito si sobraron productos sin stock
                if (hasRejectedProducts) {
                    const updateCart = await this.updateCartProducts(cid, rejectedProducts);
                    if(!updateCart) {
                        throw new Error("Error al actualizar carrito");
                    }
                }

                await this.deleteAllProducts(cid);
    
                return { ticket: newTicket, rejectedProducts };
                
            } else {
                throw new Error("Error al crear el ticket");
            }
        } catch(err) {
            throw new Error("Error al realizar la compra " + err);
        }
    }
}

export default CartsClassDB;