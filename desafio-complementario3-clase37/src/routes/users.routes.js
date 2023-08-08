import { changeRol, forgotPassword, resetPassword } from "../controllers/users.controller.js";

import { Router } from "express";
import { validateAdmin } from "../middlewares/validate.middleware.js";

const routerUser = Router();

//Cambio de rol de usuario.
routerUser.put("/users/premium/:uid", /* validateAdmin, */ changeRol);

//Envio de email de recuperación de contraseña.
routerUser.post("/forgotpassword", forgotPassword);

//Reset de contraseña.
routerUser.post("/resetpassword/:token", resetPassword);

export default routerUser;

