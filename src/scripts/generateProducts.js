require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const connectDB = require('../config/db.config');
const Product = require('../models/Product');

const categories = ['electronics', 'computers', 'accessories', 'gaming', 'audio'];
const brands = ['Apple', 'Samsung', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI'];
const productTypes = ['Laptop', 'Desktop', 'Monitor', 'Keyboard', 'Mouse', 'Headphones', 'Speaker', 'Tablet', 'Phone', 'Smartwatch'];

const generateRandomPrice = () => {
    return Math.floor(Math.random() * (2000 - 100) + 100);
};

const generateRandomStock = () => {
    return Math.floor(Math.random() * 20) + 1;
};

const generateRandomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const generateProducts = async (count = 20) => {
    try {
        await connectDB();
        
        const products = [];
        for (let i = 0; i < count; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const brand = brands[Math.floor(Math.random() * brands.length)];
            const type = productTypes[Math.floor(Math.random() * productTypes.length)];
            const title = `${brand} ${type}`;
            const code = generateRandomCode();
            const price = generateRandomPrice();
            const stock = generateRandomStock();
            const thumbnail = `${category}-${i + 1}.jpg`;

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
        for (const product of products) {
            await Product.findOneAndUpdate(
                { code: product.code },
                product,
                { upsert: true, new: true }
            );
        }

        console.log(`✅ ${count} productos generados exitosamente`);
    } catch (error) {
        console.error('❌ Error al generar productos:', error);
    } finally {
        process.exit();
    }
};

generateProducts(20); // Generar 20 productos 