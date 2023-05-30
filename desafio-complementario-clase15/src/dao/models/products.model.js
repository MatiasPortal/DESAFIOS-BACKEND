import mongoose from "mongoose";

mongoose.pluralize(null);
const collection = "products";

const productSchema = new mongoose.Schema({
    id: Number,
    title: { type: String, required: true, index: true },
    description: { type: String, required: true },
    code: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true, index: true },
    thumbnail: Array
})

const productModel = mongoose.model(collection, productSchema);

export default productModel;