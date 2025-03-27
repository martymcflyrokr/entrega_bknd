const express = require('express');
const CartManager = require('../models/CartManager');

module.exports = (cartManager) => {
    const router = express.Router();

    // Crear un nuevo carrito
    router.post('/', async (req, res) => {
        try {
            const cart = await cartManager.createCart();
            res.status(201).json(cart);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear el carrito' });
        }
    });

    // Obtener un carrito por ID
    router.get('/:cid', async (req, res) => {
        try {
            const cart = await cartManager.getCartById(req.params.cid);
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
            res.json(cart);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el carrito' });
        }
    });

    // Agregar un producto al carrito
    router.post('/:cid/products/:pid', async (req, res) => {
        try {
            const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
            res.json(cart);
        } catch (error) {
            if (error.message === 'Carrito no encontrado' || error.message === 'Producto no encontrado') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Error al agregar producto al carrito' });
        }
    });

    // Actualizar cantidad de un producto en el carrito
    router.put('/:cid/products/:pid', async (req, res) => {
        try {
            const { quantity } = req.body;
            if (!quantity || quantity < 1) {
                return res.status(400).json({ error: 'Cantidad inválida' });
            }
            const cart = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
            res.json(cart);
        } catch (error) {
            if (error.message === 'Carrito no encontrado' || error.message === 'Producto no encontrado en el carrito') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Error al actualizar cantidad' });
        }
    });

    // Eliminar un producto del carrito
    router.delete('/:cid/products/:pid', async (req, res) => {
        try {
            const cart = await cartManager.removeProductFromCart(req.params.cid, req.params.pid);
            res.json(cart);
        } catch (error) {
            if (error.message === 'Carrito no encontrado') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Error al eliminar producto del carrito' });
        }
    });

    // Vaciar el carrito
    router.delete('/:cid', async (req, res) => {
        try {
            const cart = await cartManager.clearCart(req.params.cid);
            res.json(cart);
        } catch (error) {
            if (error.message === 'Carrito no encontrado') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Error al vaciar el carrito' });
        }
    });

    return router;
};
