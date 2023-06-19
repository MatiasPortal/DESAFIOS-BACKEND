import bcrypt from "bcrypt";
import { createHash } from "../../utils.js";
import mongoose from "mongoose";
import userModel from "../models/users.model.js";

class UsersDB {
    constructor() {
        this.statusMsg = "Initialized"
    }

    //Campos requeridos.
    static requiredFields = ["firsName", "lastName", "email", "age", "password"];

    //Valida que los campos requeridos esten presentes.
    static #verifyRequiredFields = (obj) => {
        return UsersDB.requiredFields.every(field => obj.hasOwnProperty.call(obj, field) && obj[field] !== null);
    }

    static #objEmpty(obj) {
        return Object.keys(obj).length === 0;
    }


    // Mostrar mensaje de estado.
    showStatusMsg = () => {
        return this.statusMsg;
    }

    // Crear usuario nuevo. //no me agrega usuario en register
    addUser = async (user) => {
        try {
            if(!UsersDB.#objEmpty(user) && UsersDB.#verifyRequiredFields(user)) {
                user.password = createHash(user.password);
                const create = await userModel.create(user);
                create.acknowledged === true ? this.statusMsg = "Usuario creado con exito" : this.statusMsg = "No se pudo crear el usuario";
            }
        } catch (err) {
            this.statusMsg = `addUser: ${err.message}`;
        }
    };

    // Obtener usuarios.
    getUsers = async() => {
        try {
            const users = await userModel.find().populate("carts").lean();
            this.statusMsg = "Usuarios obtenidos con exito";
            return users.map(user => user.toObject());
        } catch(err) {
            this.statusMsg = `getUsers: ${err.message}`;
        } 
    };

    // Obtener usuario por id.
    getUserById = async(id) => {
        try {
            const user = await userModel.findById(id).lean();
            return user;
        } catch(err) {
            this.statusMsg = `getUserById: ${err.message}`;
        }
    };

    // update de usuario.
    updateUser = async(id, data) => {
        try {
            if(data === undefined || Object.keys(data).length === 0) {
                this.statusMsg = "No hay datos para actualizar";
            } else {
                const update = await userModel.findByIdAndUpdate({ "_id": new mongoose.Types.ObjectId(id) }, data);
                update.modifiedCount === 1 ? this.statusMsg = "Usuario actualizado con exito" : this.statusMsg = "No se pudo actualizar el usuario";
            }
        } catch(err) {
            this.statusMsg = `updateUser: ${err.message}`;
        }
    };

    // Eliminar usuario.
    deleteUser = async(id) => {
        try {
            const deleteUser = await userModel.findByIdAndDelete({ "_id": new mongoose.Types.ObjectId(id) });
            deleteUser.deletedCount === 1 ? this.statusMsg = "Usuario eliminado con exito" : this.statusMsg = "No se pudo eliminar el usuario";
        } catch(err) {
            this.statusMsg = `deleteUser: ${err.message}`;
        }
    };
}

export default UsersDB;