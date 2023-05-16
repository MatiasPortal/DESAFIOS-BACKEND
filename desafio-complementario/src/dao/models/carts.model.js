import mongoose from "mongoose";

mongoose.pluralize(null);
const collection = "carts";

const cartSchema = new mongoose.Schema({
    id: Number,
    products: {
        type: [
                {
                    product: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: "products"
                            },
                    quantity: {
                            type: Number,
                            require: true
                    }
                }
              ],
        default: [],
    }
})

const cartModel = mongoose.model(collection, cartSchema);

export default cartModel;