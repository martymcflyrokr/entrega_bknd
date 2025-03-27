require('dotenv').config();
const connectDB = require('../config/db.config');
const CartManager = require('../models/CartManager');

const initCart = async () => {
    try {
        await connectDB();
        const cartManager = new CartManager();
        const cart = await cartManager.createCart();
        console.log('✅ Carrito inicial creado:', cart._id);
    } catch (error) {
        console.error('❌ Error al crear el carrito inicial:', error);
    } finally {
        process.exit();
    }
};

initCart(); 