import ProductsDB from "../dao/services/products.dbclass.js";

const product = new ProductsDB();

// Obtener productos.
export const getProducts = async (req, res) => {
    const {limit, page, sort, category, status} = req.query;

    try {
        let products = await product.getProducts(limit, page, sort, category, status);
        res.status(200).send(products);
    
    } catch(err) {
        res.status(500).send(err.message);
    }   
};

// Agregar producto.
export const addProducts = async (req, res) => {
    try {
        let product = await req.body;
        const data = await product.addProduct(product);

        if(data.status === "error") {
            return res.status(404).send({ data });
        }
        res.status(200).send({ status: "success", product })
    } catch(err){
        res.status(500).send(err)
    }
};

// Obtener producto por id.
export const getById = async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = await product.getProductById(pid);

        res.status(200).send( { status: "success", product });
    } catch(err) {
        res.status(400).send(err);
    }
};

// Update de producto.
export const updateProduct = async (req, res) => {
    try{
        let product = await product.updateProduct(req.params.pid, req.body);
        res.status(200).send({ status: "success", product })
    } catch(err) {
        res.status(500).send(err);
    }
};

// Eliminar producto.
export const deleteProduct = async (req, res) => {
    try {
        const pid = req.params.pid;
        await product.deleteProduct(pid);

        res.status(200).send("Producto eliminado");
    } catch(err) {
        res.status(500).send(err);
    }

};


