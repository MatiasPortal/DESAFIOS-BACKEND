import { changeRol, forgotPassword, resetPassword, updateUserDoc } from "../controllers/users.controller.js";
import { validate, validateAdmin } from "../middlewares/validate.middleware.js";

import { Router } from "express";
import { docUpload } from "../middlewares/multerFiles.js";

const routerUser = Router();

//Cambio de rol de usuario.
routerUser.put("/users/premium/:uid", validateAdmin, changeRol);

// Subida de archivos.
routerUser.post("/users/:uid/documents", validate, docUpload.fields([
    { name: "identificacion", maxCount: 1 },
    { name: "domicilio", maxCount: 1 },
    { name: "statusDeCuenta", maxCount: 1 },
    { name: "imagenes", maxCount: 1 },
    { name: "products", maxCount: 1 }
]), updateUserDoc)

//Envio de email de recuperación de contraseña.
routerUser.post("/forgotpassword", forgotPassword);

//Reset de contraseña.
routerUser.post("/resetpassword/:token", resetPassword);

export default routerUser;

