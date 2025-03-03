const express = require('express');

module.exports = (io, productManager) => {
    const router = express.Router();

    // Ruta para la vista home
    router.get('/', async (req, res) => {
        const products = await productManager.getProducts();
        res.render('home', { products });
    });

    // Ruta para la vista realTimeProducts
    router.get('/realtimeproducts', async (req, res) => {
        res.render('realTimeProducts');
    });

    return router;
};
