import mongoose from "mongoose";

mongoose.pluralize(null);
const collection = "products";

const productSchema = new mongoose.Schema({
    id: Number,
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    price: { type: Number, required: true },
    status: Boolean,
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnail: { type: Array, default: [""] } 
})

const productModel = mongoose.model(collection, productSchema);

export default productModel;