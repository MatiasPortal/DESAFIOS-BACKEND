import CustomError from "./dao/services/customErrors.js";
import MongoSingleton from "./configs/mongoSingleton.js";
import ProductsDB from "./dao/services/products.dbclass.js"
import { Server } from "socket.io";
import { __dirname } from "./configs/utils.js";
import config from "./configs/config.js";
import { engine } from "express-handlebars";
import express from "express";
import http from "http";
import initializePassport from "./passport/passport.strategies.js"
import mongoose from "mongoose"
import passport from "passport"
import productModel from './dao/models/products.model.js';
import routerCart from "./routes/carts.routes.js";
import routerMocking from "./routes/mocking.routes.js";
import routerProducts from "./routes/products.routes.js";
import routerViews from "./routes/views.routes.js";
import session from "express-session";
import sessionRoutes from './routes/sessions.routes.js';
import { store } from "./configs/utils.js";

const managerDB = new ProductsDB();


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
servidor.use(session({
    store: store,
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))

// Passport
initializePassport()
servidor.use(passport.initialize())
servidor.use(passport.session())

// endpoints
servidor.use("/api", routerProducts);
servidor.use("/api", routerMocking)
servidor.use("/api", routerCart);
servidor.use("/", routerViews(store));
servidor.use("/api/sessions", sessionRoutes());

// errores
servidor.all("*", () => {
    throw new CustomError(errorsDict.NOT_FOUND_ERROR);
});
servidor.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).send({ status: "Error", message: err.message });
})



// Contenidos estáticos
servidor.use('/public', express.static(`${__dirname}/public`));

// Motor de plantillas
servidor.engine('handlebars', engine({ defaultLayout: "main", extname: ".handlebars" }));
servidor.set('view engine', 'handlebars');
servidor.set('views', './views');

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
    await MongoSingleton.getInstance();

    servidor.listen(config.PUERTO, () => {
        console.log(`Servidor iniciado en puerto: ${config.PUERTO}`);
    });
} catch(err) {
    console.log(`No se pudo iniciar el servidor: ${err.message}`)
}




