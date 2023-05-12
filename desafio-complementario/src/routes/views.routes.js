import  ProductsDB from "../dao/managerDB/products.dbclass.js";
import { Router } from "express";

const routerViews = Router();


const productManager = new ProductsDB()

routerViews.get('/',async(req,res)=>{
    try{
        const products = await productManager.getProducts()
        res.render("home",{products})
    }catch(error){
        console.log(error)
        res.status(500).send('Error obteniendo los productos')
    }
});

routerViews.get('/realtimeproducts',async(req,res)=>{
    const currentProducts = await productManager.getProducts()
    res.render('realTimeProducts',{products: currentProducts});
});


export default routerViews;
