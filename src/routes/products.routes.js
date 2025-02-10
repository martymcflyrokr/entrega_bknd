const express = require('express');

module.exports = (productManager) => {
    const router = express.Router();

    router.get('/', async (req, res) => {
        try {
            const products = await productManager.getProducts();
            res.json({ products });   
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los productos' });
        }
    });

    router.post('/', async (req, res) => {
        console.log("Datos recibidos:", req.body);

        try {
            const { title, description, price, thumbnail, code, stock } = req.body;

            if (
                !title || !description || !price || !thumbnail || !code || !stock ||
                typeof title !== 'string' || typeof description !== 'string' ||
                typeof price !== 'number' || typeof thumbnail !== 'string' ||
                typeof code !== 'string' || typeof stock !== 'number'
            ) {
                return res.status(400).json({ error: 'Todos los campos son obligatorios y deben tener el tipo de dato correcto' });
            }

            const newProduct = await productManager.addProduct({ title, description, price, thumbnail, code, stock });
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.get('/:pid', async (req, res) => {
        try {
            const product = await productManager.getProductById(req.params.pid);
            if (!product) {
                return res.status(404).json({ error: 'El producto no fue encontrado. Verificar ID de producto.' });
            }
            res.json({ product });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el producto' });
        }
    });

    router.put('/:pid', async (req, res) => {
        try {
            const { pid } = req.params; 
            const { title, description, price, thumbnail, code, stock } = req.body;

            if (
                typeof title !== 'string' || title.trim() === '' ||
                typeof description !== 'string' || description.trim() === '' ||
                typeof price !== 'number' || isNaN(price) ||
                typeof thumbnail !== 'string' || thumbnail.trim() === '' ||
                typeof code !== 'string' || code.trim() === '' ||
                typeof stock !== 'number' || isNaN(stock)
            ) {
                return res.status(400).json({ error: 'Todos los campos son obligatorios' });
            }
    
            const updatedProduct = await productManager.updateProduct(pid, { title, description, price, thumbnail, code, stock });
    
            if (!updatedProduct) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
    
            res.json(updatedProduct);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el producto' });
        }
    });

    router.delete('/:pid', async (req, res) => {
        try {
            const { pid } = req.params;
            const deletedProduct = await productManager.deleteProduct(pid);
            if (!deletedProduct) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.json({message: 'producto eliminado correctamente', product: deletedProduct});
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar el producto' });
        }
    });

    return router;
};
