import express from 'express';
import {CartModel} from '../../models/cartModel.js';
import { ProductModel } from '../../models/productModel.js';

const router = express.Router();

//Creamos un carrito
router.post('/', async (req, res) => {
    try {
        const { body } = req;
        const response = await CartModel.create(body);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json(error.message);
    }
});


// Buscamos el carrito de compra especifico
router.get ('/:cid', async (req, res) => {
    const cid = req.params.cid;
    try {
        const cart = await CartModel.findOne({ _id : cid}).populate('products.product');

        if (cart) {
            res.send({ status: 'Success', payload: cart });
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error('Error al buscar el carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    } 
});


//Agregamos un producto especifico al carrito
router.put('/:cid/products', async (req, res) => {
    const cid = req.params.cid;
    const { body } = req;
    const id = body.id;
    try {
        const cart = await CartModel.findOne({ _id: cid });
        const product = await ProductModel.findOne({ _id: id }); 
        if (cart && product) {
            const existingProduct = cart.products.find(p => p.product == id);
            if (existingProduct) {
                existingProduct.quantity +=1;
            } else {
                cart.products.push({ "product": product.id, "quantity": 1});}// Si el producto no existe en el carrito, lo agregamos
            await cart.save();// Guardamos los cambios en el carrito
            res.send({ status: 'Success', payload: cart });
        } else {
            res.status(404).json({ error: 'Carrito o producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al buscar el carrito o producto:', error);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
});


//Elimininamos un producto especifico del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {
        const cart = await CartModel.findOne({ _id: cid });
        const product = await ProductModel.findOne({ _id: pid }); 
        
        if (cart && product) {
            const existingProduct = cart.products.find(p => p.product == pid);
            if (existingProduct) {
                cart.products.splice(p => p.product != pid);
                
            }
            
            // Guardamos los cambios en el carrito
            await cart.save();
            res.send({ status: 'Success', payload: cart });
        } else {
            res.status(404).json({ error: 'Carrito o producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al buscar el carrito o producto:', error);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
});


//limipamos el carrito de compras
router.put('/:cid', async (req, res) => {
    const cid = req.params.cid;
    try {
        const cart = await CartModel.findOne({ _id: cid });     
        if (cart) {
            cart.products.splice (0, cart.products.length);
            
            // Guardamos los cambios en el carrito
            await cart.save();
            res.send({ status: 'Success', payload: cart });
        } else {
            res.status(404).json({ error: 'Carrito o producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al buscar el carrito o producto:', error);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
});


export default router;