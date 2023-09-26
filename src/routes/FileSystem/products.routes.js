import { Router } from "express";
import { ProductManager } from "../managers/productManager.js";

const router = Router();

let productManager = new ProductManager();

//Devuelve todos los productos
router.get('/', async (req, res) => {
    const productos = await productManager.getProducts();
    const prodObjeto = JSON.parse(productos); 
    res.send({status: 'Success', payload: prodObjeto});
}) 

//Devuelve la cantidad de productos segun el query limit
/* router.get('/query', async (req, res) => {
    const {limit} = req.query;
    if (limit == undefined) {
        const productos = await productManager.getProducts();
        const prodObjeto = JSON.parse(productos); 
        res.send({status: 'Success', payload: prodObjeto});
    }else if(limit > 0){
        const productos = await productManager.getProducts();
        const prodObjeto = JSON.parse(productos); 
        const prodFiltrados = prodObjeto.slice(0, limit);
        res.send({status: 'Success', payload: prodFiltrados});
    }else {
        res.json ({error: 'El monto requerido supera la cantidad de productos'});
    }
}) */

router.get('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const id = parseInt(pid);
    const producto = await productManager.getProductById(id);
    if (producto) {
        res.send({status: 'Success', payload: producto});
    }else {
        res.json ({error: 'producto no encontrado'});
    }
    
})

router.post('/', async (req, res) => {
    const {title, description, price, thumbnail, code, stock, status, category} = req.body;
    const nuevoProducto = {title, description, price, thumbnail, code, stock, status, category};
    await productManager.addProduct(nuevoProducto); 
    if (nuevoProducto) {
        res.send({status: 'Success', payload: nuevoProducto});
    }else {
        res.json ({error:`Error al crear el producto nuevo`});
    }
})

router.put('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const id = parseInt(pid);
    const producto = req.body;
    console.log(producto);
    await productManager.updateProduct(id, producto);
    if (producto) {
        res.send({status: 'Success', payload: producto});
    }else {
        res.json ({error:`Error al actualizar el producto`});
    }
})

router.delete('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const id = parseInt(pid);
    await productManager.deleteProduct(id);
    res.send({status: 'Success', payload: 'Producto eliminado'});
})
export default router;