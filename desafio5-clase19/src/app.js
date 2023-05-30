import * as dotenv from 'dotenv'

import MongoStore from "connect-mongo"
import ProductsDB from "./dao/managerDB/products.dbclass.js"
import { Server } from "socket.io";
import { __dirname } from "./utils.js";
import { engine } from "express-handlebars";
import express from "express";
import http from "http";
import loginRoutes from './routes/sessions.routes.js';
import mongoose from "mongoose"
import productModel from './dao/models/products.model.js';
import routerCart from "./routes/carts.routes.js";
import routerProducts from "./routes/products.routes.js";
import routerViews from "./routes/views.routes.js";
import session from "express-session";

const managerDB = new ProductsDB();

// Activar variables de entorno.
dotenv.config({ path:"../.env" })
const PUERTO = parseInt(process.env.PUERTO) || 8080;
//const MONGOOSE_URL = process.env.MONGOOSE_URL;
const MONGOOSE_URL_ATLAS = process.env.MONGOOSE_URL_ATLAS;
const SESSION_SECRET = process.env.SESSION_SECRET;
const EMAIL_ADMIN = process.env.EMAIL_ADMIN;
const PASS_ADMIN = process.env.PASS_ADMIN;

// Servidor express y socket.io
const servidor = express();
const httpServer = http.createServer(servidor);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: false
    }
});

// Parseo correcto
servidor.use(express.json())
servidor.use(express.urlencoded({ extended: true }));

// Gestión de sesiones
const store = MongoStore.create({ mongoUrl: MONGOOSE_URL_ATLAS, mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true  } });

servidor.use(session({
    store: store,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))


// endpoints
servidor.use("/api", routerProducts);
servidor.use("/api", routerCart);
servidor.use("/", routerViews);
servidor.use("/", loginRoutes(store, EMAIL_ADMIN, PASS_ADMIN))

// Motor de plantillas
servidor.engine('handlebars', engine({ defaultLayout: "main", extname: ".handlebars" }));
servidor.set('view engine', 'handlebars');
servidor.set('views', './views');

// Contenidos estáticos
servidor.use('/public', express.static(`${__dirname}/public`));

// Eventos socket.io
io.on('connection', (socket) => {
    console.log(`Cliente conectado: (${socket.id})`);//conexion de usuario

    socket.on("disconnect", (reason) => {
        console.log(`Cliente desconectado: (${socket.id}): ${reason}`);//desconexion de usuario
    });

    socket.emit("server_confirm", "Conexión recibida");//confirmacion de conexion.

    socket.on("producto", async (data) => {//Agregar producto.
        let product = await productModel.create(data)
        console.log(product)
    });

    socket.on("id", (data) => {//Eliminar producto por id.
        console.log(data);
        managerDB.deleteProduct(data);
    });
});

// Conexión del servidor.
try {
    await mongoose.connect(MONGOOSE_URL_ATLAS);

    servidor.listen(PUERTO, () => {
        console.log(`Servidor iniciado en puerto: ${PUERTO}`);
    });
} catch(err) {
    console.log(err)
}




