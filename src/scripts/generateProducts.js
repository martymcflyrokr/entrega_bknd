require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const connectDB = require('../config/db.config');
const Product = require('../models/Product');

const categories = ['electronics', 'computers', 'accessories', 'gaming', 'audio'];
const brands = ['Apple', 'Samsung', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI'];
const productTypes = ['Laptop', 'Desktop', 'Monitor', 'Keyboard', 'Mouse', 'Headphones', 'Speaker', 'Tablet', 'Phone', 'Smartwatch'];

// Mapeo de tipos de productos a categorías
const productTypeToCategory = {
    'Laptop': 'computers',
    'Desktop': 'computers',
    'Monitor': 'computers',
    'Keyboard': 'accessories',
    'Mouse': 'accessories',
    'Headphones': 'audio',
    'Speaker': 'audio',
    'Tablet': 'electronics',
    'Phone': 'electronics',
    'Smartwatch': 'electronics'
};

const generateRandomPrice = () => {
    return Math.floor(Math.random() * (2000 - 100) + 100);
};

const generateRandomStock = () => {
    return Math.floor(Math.random() * 20) + 1;
};

const generateRandomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Función para obtener un número de imagen aleatorio entre 1 y 4
const getRandomImageNumber = () => {
    return Math.floor(Math.random() * 4) + 1;
};

const generateProducts = async (count = 20) => {
    try {
        await connectDB();
        
        // Primero, eliminar todos los productos existentes
        await Product.deleteMany({});
        console.log('🗑️ Productos existentes eliminados');
        
        const products = [];
        for (let i = 0; i < count; i++) {
            const type = productTypes[Math.floor(Math.random() * productTypes.length)];
            const category = productTypeToCategory[type] || categories[Math.floor(Math.random() * categories.length)];
            const brand = brands[Math.floor(Math.random() * brands.length)];
            const title = `${brand} ${type}`;
            const code = generateRandomCode();
            const price = generateRandomPrice();
            const stock = generateRandomStock();
            const imageNumber = getRandomImageNumber(); // Usar la nueva función
            const thumbnail = `${category}-${imageNumber}.jpg`;

            products.push({
                title,
                description: `${brand} ${type} de alta calidad con las últimas tecnologías`,
                price,
                thumbnail: `/img/${thumbnail}`,
                code,
                stock,
                category,
                status: true
            });
        }

        // Guardar los productos en MongoDB
        await Product.insertMany(products);

        console.log(`✅ ${count} productos generados exitosamente`);
    } catch (error) {
        console.error('❌ Error al generar productos:', error);
    } finally {
        process.exit();
    }
};

generateProducts(20); // Generar 20 productos 