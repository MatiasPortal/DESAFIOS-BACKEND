import mongoose from "mongoose";

const collection = "users";

const schema = new mongoose.Schema({
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    role: { type: String, trim: true, default: "user", enum: ["user", "admin"] }
});

const userModel = mongoose.model(collection, schema);

export default userModel;