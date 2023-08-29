import { __dirname } from "../configs/utils.js";
import multer from "multer";
import path from "path";

const docStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        // nombre del campo.
        const fieldname = file.fieldname;
        console.log(fieldname);

        const folders = {
            identificacion: "identifications",
            domicilio: "addresses",
            statusDeCuenta: "statusAccounts",
            imagenes: "profiles",
            products: "products"
        };

        const folderName = folders[fieldname] || "others";
        console.log(folderName);

        const dir = path.join(__dirname, `../public/documents/${folderName}`);

        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(
            null,
            `${req.session.user.email}-document-${new Date().getMinutes()}${file.originalname}`
        )
    }
});

export const docUpload = multer({ storage: docStorage });