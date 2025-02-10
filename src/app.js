const express = require('express');
const ProductManager = require('./models/ProductManager');
const CartManager = require('./models/CartManager');
const path = require('path');

const app = express();
app.use(express.json());

const productManager = new ProductManager(path.resolve(__dirname, 'data/products.json')); 
const cartManager = new CartManager(path.resolve(__dirname, 'data/carts.json')); 

const productRoutes = require('./routes/products.routes');
const cartRoutes = require('./routes/carts.routes');

app.use('/api/products', productRoutes(productManager));
app.use('/api/carts', cartRoutes);

const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
