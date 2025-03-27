const express = require('express');

module.exports = (io, productManager, cartManager) => {
    const router = express.Router();

    // Ruta para la vista home
    router.get('/', async (req, res) => {
        try {
            const result = await productManager.getProducts({});
            res.render('home', { products: result.payload });
        } catch (error) {
            res.status(500).render('error', { 
                error: 'Error al obtener los productos'
            });
        }
    });

    // Ruta para la vista de productos con paginación
    router.get('/products', async (req, res) => {
        try {
            const { limit = 10, page = 1, sort, query } = req.query;
            let queryObj = {};
            
            if (query) {
                try {
                    queryObj = JSON.parse(query);
                } catch (e) {
                    return res.status(400).render('error', { 
                        error: 'El formato del query no es válido'
                    });
                }
            }

            const result = await productManager.getProducts({
                limit: parseInt(limit),
                page: parseInt(page),
                sort,
                query: queryObj
            });

            // Asegurarnos de que la estructura de datos sea la correcta
            const viewData = {
                payload: result.payload || [],
                totalPages: result.totalPages || 1,
                page: result.page || 1,
                hasPrevPage: result.hasPrevPage || false,
                hasNextPage: result.hasNextPage || false,
                prevLink: result.prevLink || '',
                nextLink: result.nextLink || ''
            };

            res.render('products', viewData);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).render('error', { 
                error: 'Error al obtener los productos'
            });
        }
    });

    // Ruta para la vista de detalle de producto
    router.get('/products/:pid', async (req, res) => {
        try {
            const product = await productManager.getProductById(req.params.pid);
            if (!product) {
                return res.status(404).render('error', { 
                    error: 'Producto no encontrado'
                });
            }
            res.render('product-detail', { product });
        } catch (error) {
            res.status(500).render('error', { 
                error: 'Error al obtener el producto'
            });
        }
    });

    // Ruta para la vista del carrito
    router.get('/carts/:cid', async (req, res) => {
        try {
            const cart = await cartManager.getCartById(req.params.cid);
            if (!cart) {
                return res.status(404).render('error', { 
                    error: 'Carrito no encontrado'
                });
            }
            // Calcular el total del carrito
            const total = cart.products.reduce((sum, item) => {
                return sum + (item.product.price * item.quantity);
            }, 0);
            
            res.render('cart', { cart, total });
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            res.status(500).render('error', { 
                error: 'Error al obtener el carrito'
            });
        }
    });

    // Ruta para la vista realTimeProducts
    router.get('/realtimeproducts', async (req, res) => {
        res.render('realTimeProducts');
    });

    return router;
};
