require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const connectDB = require('../config/db.config');
const Product = require('../models/Product');

const migrateData = async () => {
    try {
        // Conectar a MongoDB
        await connectDB();

        // Leer el archivo JSON existente
        const productsData = JSON.parse(
            await fs.readFile(path.join(__dirname, '../data/products.json'), 'utf8')
        );

        // Insertar o actualizar los productos en MongoDB
        for (const product of productsData) {
            const { id, ...productData } = product;
            await Product.findOneAndUpdate(
                { code: productData.code },
                {
                    ...productData,
                    category: 'electronics', // Categoría por defecto
                    thumbnail: `/img/${productData.thumbnail}` // Agregar la ruta de la imagen
                },
                { upsert: true, new: true }
            );
        }

        console.log('✅ Migración completada exitosamente');
    } catch (error) {
        console.error('❌ Error durante la migración:', error);
    } finally {
        process.exit();
    }
};

migrateData(); 