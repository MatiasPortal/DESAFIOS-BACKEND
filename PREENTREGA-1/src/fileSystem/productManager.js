const fs = require("fs");

class ProductManager {
    static productId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;
    }


    //devolver los productos.
    getProducts = async() => {    
            const productsFile = await fs.promises.readFile(this.path, "utf-8");
            const products = JSON.parse(productsFile)
            return products;
    }

    //agregar los productos.
    addProduct = async (product) => {
        try {
            await this.getProducts(); // leo mis productos
            let codProd = this.products.find((prod) => prod.code === product.code);
            let prodId = 0;

            if (this.products.length === 0) {
                prodId = 1; 
            } else {
                prodId = this.products[this.products.length - 1].id + 1;
            }

            if (
                !product.title || // Verifico que ningun campo este vacio
                !product.description ||
                !product.price ||
                !product.stock ||
                !product.code ||
                !product.category
            )
            return { status: "error", message: "Todos los campos son requeridos!" };

            if (product.thumbnail === undefined) {
                product.thumbnail = [];
            }
            if (product.status === undefined) {
                product.status = true;
            }

            if (codProd) return { status: "error", message: "Code repetido!" };

            this.products.push({ id: prodId, ...product }); //pusheo mi producto
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
            console.log(product); //Guardo mi array products en mi archivo.
            return `Se agregó el producto "${product.title}"`;
            
        } catch (error) {
            return error;
        }
    };

    //buscar producto con id específico.
    getProductById = async (id) => {
            const productsFile = await fs.promises.readFile(this.path, "utf-8")
            const productID = JSON.parse(productsFile).find(prod => prod.id === id);
            return productID;
    }


    updateProduct = async(id, object) => {
        const productsFile = await fs.promises.readFile(this.path, "utf-8");
        const  products = JSON.parse(productsFile);
        const index = products.findIndex((prod) => prod.id === id);

        if(index !== -1) {
            products[index] = { ...products[index], ...object, id} //mantengo el id del producto.
            await fs.promises.writeFile(this.path, JSON.stringify(products,  null, 2));
            console.log(`Se modificó el producto con id ${id}`)
        } else {
            console.log(`No se encontró el producto con id ${id}`)
        }
    }

    deleteProduct = async(id) => {
        const productsFile = await fs.promises.readFile(this.path, "utf-8");
        const productToDelete = JSON.parse(productsFile).filter(prod => prod.id === id)

        this.products = productToDelete;
        await fs.promises.writeFile(this.path, JSON.stringify(this.products))
        console.log(`se borró el producto con el id ${id}`)
    }
}



module.exports = ProductManager;