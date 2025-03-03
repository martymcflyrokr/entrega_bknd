// ProductManager.js

const fs = require('fs').promises;
const path = require('path');

class ProductManager {
    constructor(filePath) {
        this.filePath = path.resolve(filePath);
    }

    async readFile() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            console.log('Productos leídos:', data); // Esto mostrará los datos leídos
            return JSON.parse(data);
        } catch (error) {
            console.log('Error reading file:', error);
            return [];
        }
    }

    async writeFile(data) {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
        } catch (error) {
            console.log('Error writing file:', error);
        }
    }

    async addProduct(product) {
        const products = await this.readFile();
        const newProduct = { id: products.length + 1, ...product };

        // Verifica si el nuevo producto tiene todos los campos requeridos
        if (!newProduct.title || !newProduct.price) {
            console.log('Producto inválido:', newProduct);
            return null; // Si el producto es inválido, no lo agrega
        }

        products.push(newProduct);
        console.log('Producto agregado y guardado:', newProduct);  // Verifica que el producto se guarda
        await this.writeFile(products);
        return newProduct;
    }

    async deleteProduct(productId) {
        let products = await this.readFile();
        products = products.filter(product => product.id !== parseInt(productId, 10));
        await this.writeFile(products);
    }

    async getProducts() {
        return await this.readFile();
    }

    getProductsSync() {
        try {
            const data = require(this.filePath);
            return data;
        } catch (error) {
            return [];
        }
    }
}

module.exports = ProductManager;
