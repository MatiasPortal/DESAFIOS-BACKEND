import ProductManager from "./fileSystem/productManager.js";
import { Server } from "socket.io";
import { __dirname } from "./utils.js";
import { engine } from "express-handlebars";
import express from "express";
import routerCart from "./routes/carts.routes.js";
import routerProducts from "./routes/products.routes.js";
import routerViews from "./routes/views.routes.js";

const productManager = new ProductManager("./db/products.json");

const PUERTO = 8080;
const WS_PORT = 8090;

const servidor = express();
const httpServer = servidor.listen(WS_PORT, () => {
    console.log(`Servidor websocket iniciado en puerto: ${WS_PORT}`);
});


const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:8080"
    }
});

servidor.use(express.json())
servidor.use(express.urlencoded({ extended: true }));

//endpoitns
servidor.use("/api", routerProducts);
servidor.use("/api", routerCart);
servidor.use("/", routerViews);

// Motor de plantillas
servidor.engine('handlebars', engine());
servidor.set('view engine', 'handlebars');
servidor.set('views', './views');

// Contenidos estáticos
servidor.use('/public', express.static(`${__dirname}/public`));

//socket.io

io.on('connection', (socket) => {
    console.log(`Cliente conectado: (${socket.id})`);//conexion de usuario

    socket.on("disconnect", (reason) => {
        console.log(`Cliente desconectado: (${socket.id}): ${reason}`);//desconexion de usuario
    });

    socket.emit("server_confirm", "Conexión recibida");//confirmacion de conexion.

    socket.on("producto", (data) => {//Agregar producto.
        console.log(data)
        productManager.addProduct(data);
    });

    socket.on("id", (data) => {//Eliminar producto por id.
        console.log(data);
        productManager.deleteProduct(data);
    });
});


servidor.listen(PUERTO, () => {
    console.log(`Servidor iniciado en puerto: ${PUERTO}`);
});

