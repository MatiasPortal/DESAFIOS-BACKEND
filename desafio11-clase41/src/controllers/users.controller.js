import CustomError from "../dao/services/customErrors.js";
import UsersDB from "../dao/services/users.dbclass.js";
import errorsDict from "../configs/dictionary.errors.js";

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
        return err;
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
}





