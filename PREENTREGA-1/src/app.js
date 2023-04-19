const express = require("express");
const routerCart = require("./routes/carts.routes");
const routerProducts = require("./routes/products.routes");

const PUERTO = 8080;

const servidor = express();
servidor.use(express.json())
servidor.use(express.urlencoded({ extended: true }));

servidor.use("/api", routerProducts);
servidor.use("/api", routerCart);

servidor.listen(PUERTO, () => {
    console.log(`Servidor iniciado en puerto: ${PUERTO}`);
});

