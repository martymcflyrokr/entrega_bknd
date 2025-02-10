const fs = require('fs').promises;
const path = require('path');

class ProductManager {
    constructor(filePath) {
        if (!filePath) {
            throw new Error('No se ha especificado una ruta valida para el archivo de productos');
        }
        this.filePath = path.resolve(filePath);
    }

    async readFile() {
        const data = await fs.readFile(this.filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.warn(`⚠️ Archivo no encontrado: ${this.filePath}. Creando uno nuevo.`);
            return [];
        }
        throw error;
    }
 
    async writeFile(data) {
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2),'utf8');
    }

    async addProduct({ title, description, price, thumbnail, code, stock }) {
        const products = await this.readFile();

        if (products.some(product => product.code === code)) {
            throw new Error(`Ya existe un producto con el codigo: '${code}' Por favor verifica el codigo.`);
        }
        
        const newProduct = {
            id: products.length + 1, 
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        products.push(newProduct);
        await this.writeFile(products);
        return newProduct;

    }

    async getProducts() {
        return await this.readFile();
    }
    
    async getProductById(id) {
        const products = await this.readFile();
        id = parseInt(id, 10);
        const product = products.find(prod => prod.id === id);
        return product || null;
    }

    async updateProduct(id, { title, description, price, thumbnail, code, stock }) {
        const products = await this.readFile();
        id = parseInt(id, 10);
        const productIndex = products.findIndex(prod => prod.id === id);

        if (productIndex === -1) {
            throw new Error('Producto no encontrado');
        }

        const updatedProduct = {
            ...products[productIndex],
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        products[productIndex] = updatedProduct;
        await this.writeFile(products);
        return updatedProduct;
    }

    async deleteProduct(id) {
        const products = await this.readFile();
        id = parseInt(id, 10);
    
        const productIndex = products.findIndex(prod => prod.id === id);
        if (productIndex === -1) return null;
    
        const deletedProduct = products.splice(productIndex, 1)[0];
    
        await this.writeFile(products);
        
        return deletedProduct; 
    }
}

module.exports = ProductManager;

