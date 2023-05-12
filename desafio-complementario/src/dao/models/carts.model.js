import mongoose from "mongoose";

mongoose.pluralize(null);
const collection = "carts";

const cartSchema = new mongoose.Schema({
    id: Number,
    products: { type: Array, required: true }
})

const cartModel = mongoose.model(collection, cartSchema);

export default cartModel;