import * as dotenv from 'dotenv'

import ProductsDB from "./dao/managerDB/products.dbclass.js"
import { Server } from "socket.io";
import { __dirname } from "./utils.js";
import { engine } from "express-handlebars";
import express from "express";
import mongoose from "mongoose"
import productModel from './dao/models/products.model.js';
import routerCart from "./routes/carts.routes.js";
import routerProducts from "./routes/products.routes.js";
import routerViews from "./routes/views.routes.js";

/* import ProductManager from "./dao/fileSystem/productManager.js" */

const managerDB = new ProductsDB();


/* const productManager = new ProductManager("./db/products.json"); */

// Activar variables de entorno.
dotenv.config({ path:"../.env" })
const PUERTO = parseInt(process.env.PUERTO) || 8080;
/* const MONGOOSE_URL = process.env.MONGOOSE_URL; */
const MONGOOSE_URL_ATLAS = process.env.MONGOOSE_URL_ATLAS;


const WS_PORT = 8090;

const servidor = express();

const httpServer = servidor.listen(WS_PORT, () => {
    console.log(`Servidor websocket iniciado en puerto: ${WS_PORT}`);
});


const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:8000"
    }
});

servidor.use(express.json())
servidor.use(express.urlencoded({ extended: true }));

// endpoitns
servidor.use("/api", routerProducts);
servidor.use("/api", routerCart);
servidor.use("/", routerViews);

// Motor de plantillas
servidor.engine('handlebars', engine({ defaultLayout: "main", extname: ".handlebars" }));
servidor.set('view engine', 'handlebars');
servidor.set('views', './views');

// Contenidos estáticos
servidor.use('/public', express.static(`${__dirname}/public`));

// socket.io en realtimeproducts.handlebars
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




