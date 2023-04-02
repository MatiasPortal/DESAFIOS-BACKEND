const fs = require("fs");

class ProductManager {
    static productId = 0;

    constructor() {
        this.products = [];
        this.path = "./desafio2/products.txt";
    }


    async addProduct(title, description, price, thumbnail, code, stock) {

        const yaEstaEnUso = this.products.find(product => product.code === code);

        yaEstaEnUso ? console.log(`¡El code ${code} ya está en uso!`) : console.log("¡Este code se puede utilizar!");

        const newProduct = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        if(!Object.values(newProduct).includes(undefined)) {
            //aplicar id nuevo a cada producto.
            ProductManager.productId++

            //pushear el producto nuevo al array vacio.
            this.products.push({
                ...newProduct,
                id: ProductManager.productId
        })
        } else {
            console.log("¡Falta rellenar un campo!")
        }

        await fs.writeFile(this.path, JSON.stringify(this.products), (err) => err && console.error(err))
    }

    //devolver los productos.
    getProducts = async() => {    
            const productsFile = await fs.promises.readFile(this.path, "utf-8");
            const products = JSON.parse(productsFile)
            console.log(products)
    }

    //buscar producto con id específico.
    getProductById = async (id) => {
            const productsFile = await fs.promises.readFile(this.path, "utf-8")
            const productID = JSON.parse(productsFile).find(prod => prod.id === id);
            console.log(productID)
    }


    updateProduct = async(id, object) => {
        const productsFile = await fs.promises.readFile(this.path, "utf-8");
        const  products = JSON.parse(productsFile);
        const index = products.findIndex((prod) => prod.id === id);

        if(index !== -1) {
            products[index] = { ...products[index], ...object, id} //mantengo el id del producto.
            await fs.promises.writeFile(this.path, JSON.stringify(products));
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


    const newProduct = new ProductManager();

    newProduct.addProduct("producto1", "descripcion1", 1000, "image1", "a123", 10);

    newProduct.addProduct("producto2", "descripcion2", 2000, "image2", "a124", 15);

    newProduct.getProducts(); //Llamar a los productos.

    newProduct.getProductById(2); //Buscar producto por id.

    newProduct.updateProduct(1, {price: 1300}) //modificar producto.

    /* newProduct.deleteProduct(2); */ //Eliminar producto.
    
