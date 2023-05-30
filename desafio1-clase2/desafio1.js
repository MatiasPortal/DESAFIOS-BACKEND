class ProductManager {
    static productId = 0;
    
    constructor() {
        this.products = [];
    }
    
    addProduct(title, description, price, thumbnail, code, stock) {

        //bucle para buscar si está repetido "code".
        for(let i = 0; i < this.products.length; i++){
            if(this.products[i].code === code) {
                console.log(`Producto "${title}", el code ${code} ya está en uso.`);
                break;
            }
        }

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
    }
    
    getProducts() {
        return console.log(this.products);
    }

    existe(id) {
        return this.products.find((prod) => prod.id === id)
    }

     //mostrar si existe un producto por id o no.
    getProductById(id) {
        this.existe(id) ? console.log(this.existe(id)) : console.log("Not Found");
    }
}





const productos = new ProductManager

//Primer llamado = arry vacio.
productos.getProducts(); 

//agregar producto.
productos.addProduct("producto1", "descripcion1", 1000, "image1", "a123", 10);

//producto sin un campo.
productos.addProduct("producto2", "descripcion2", 2000, "image2", "a124");

//"code" repetido.
productos.addProduct("producto3", "descripcion3", 2000, "image3", "a123", 6);

//array con productos.
productos.getProducts();

//Llamar id existente.
productos.getProductById(1); 

//Llamar id que no existe.
productos.getProductById(4); 