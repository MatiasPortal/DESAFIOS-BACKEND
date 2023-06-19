import mongoose from "mongoose";

const collection = "users";

const schema = new mongoose.Schema({
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, trim: true },
    age: { type: Number },
    password: { type: String },
    carts: { 
        type: [ mongoose.Schema.Types.ObjectId ],
        ref: "carts"
    },
    role: { type: String, trim: true, default: "user", enum: ["user", "admin"] }
});

const userModel = mongoose.model(collection, schema);

export default userModel;