import * as dotenv from 'dotenv'
import * as url from 'url';

import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

dotenv.config({ path:"../.env" })


const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

//BCRYPT

// crear hasheo
const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

// validar password
const validPassword = (password, user) => {
    return bcrypt.compareSync(password, user.password);
}


//TOKEN
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// generar token
const generateToken = (user) => {
    const token = jwt.sign({user}, PRIVATE_KEY, { expiresIn: "3h" })
    return token;
}

// validar token
const authToken = (req, res, next) => {
    const authHeader = req.headers.autorization;

    if (!authHeader) return res.status(401).json({ message: "No autenticado"});
    console.log(authHeader)

    const token = authHeader.split(" ")[1];

    jwt.verify(token, PRIVATE_KEY, (err, credentials) => {
        if(err) return res.status(401).json({ message: "No autorizado"});

        req.user = credentials.user;
        next();
    })
}


export { __filename, __dirname, createHash, validPassword, generateToken, authToken };