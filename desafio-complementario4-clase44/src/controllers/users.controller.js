import CustomError from "../dao/services/customErrors.js";
import UsersDB from "../dao/services/users.dbclass.js";
import errorsDict from "../configs/dictionary.errors.js";
import userModel from "../dao/models/users.model.js";

const user = new UsersDB();

// Cambio de rol para usuario.
export const changeRol = async (req, res, next) => {
    try {
        const userId = req.params.uid;
        console.log("user id: ", userId)
        await user.changeRol(userId);

        res.send({ status: "success", message: "Rol actualizado" })
    } catch(err) {
        next(err);
    }
};

// Enviar correo de recuperación de contraseña.
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const updatePassword = await user.forgotPassword(email);
        
        
        res.send({ status: "success", message: "¡Correo de recuperación de contraseña enviado!" })
    
    }catch(err) {
        next(err);
    }
};

// reseteo de contraseña.
export const resetPassword = async (req, res, next) => {
    try {
        const token = req.params.token;
        const { newPassword } = req.body;

        const updatePassword = await user.resetPassword(newPassword, token);

        res.send({ status: "success", message: "Contraseña actualizada" })
    }
     catch(err) {
        next(err);
    }
};

// view para recuperar contraseña.
export const resetPasswordView = async (req, res, next) => {
    const token = req.params.token;
    res.render("resetPassword", { token });
};

// view para envio de email de recuperación de contraseña.
export const forgotPasswordView = async (req, res, next) => {
    res.render("forgotPassword");
};

export const updateUserDoc = async (req, res, next) => {
    try {
        const { userId } = req.params.uid;
        const user = await userModel.findById(userId);

        if(!user) {
            throw new CustomError(errorsDict.NOT_FOUND_ERROR);
        }

        const identificacion = req.files["identificacion"][0] || null;
        const domicilio = req.files["domicilio"][0] || null;
        const statusDeCuenta = req.files["statusDeCuenta"][0] || null;
        const docs = [];

        if(identificacion) {
            docs.push({ name: "identificacion", reference: identificacion.filename })
        }

        if(domicilio) {
            docs.push({ name: "domicilio", reference: domicilio.filename })
        }

        if(statusDeCuenta) {
            docs.push({ name: "statusDeCuenta", reference: statusDeCuenta.filename })
        }

        if(docs.length === 3) {
            user.status  = "completo";
        } else {
            user.status = "incompleto";
        }
        
        user.documents = docs;

        const userUpdate = await userModel.findByIdAndUpdate(user._id, user, { new: true });

        res.json({ status: "success", message: "Documentos actualizados", userUpdate });
    } catch(err) {
        next(err)
    }
}





