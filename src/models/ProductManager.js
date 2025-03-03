const fs = require('fs').promises;
const path = require('path');

class ProductManager {
    constructor(filePath) {
        if (!filePath) {
            throw new Error('No se ha especificado una ruta válida para el archivo de productos');
        }
        this.filePath = path.resolve(filePath);
    }

    // Leer archivo
    async readFile() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            console.log('Productos leídos:', data); // Para verificar los datos leídos
            return JSON.parse(data);
        } catch (error) {
            console.log('Error al leer el archivo:', error);
            if (error.code === 'ENOENT') {
                console.warn(`⚠️ Archivo no encontrado: ${this.filePath}. Creando uno nuevo.`);
                return []; // Si no existe el archivo, retorna un arreglo vacío
            }
            throw error; // Si es otro error, lo lanza
        }
    }

    // Escribir archivo
    async writeFile(data) {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
            console.log('Archivo actualizado correctamente');
        } catch (error) {
            console.log('Error al escribir el archivo:', error);
        }
    }

    // Obtener productos (sincrónico)
    getProductsSync() {
        try {
            const data = require(this.filePath);
            return data;
        } catch (error) {
            return [];
        }
    }

    // Obtener todos los productos
    async getProducts() {
        return await this.readFile();
    }

    // Obtener producto por ID
    async getProductById(id) {
        const products = await this.readFile();
        id = parseInt(id, 10);
        const product = products.find(prod => prod.id === id);
        return product || null;
    }

    // Agregar producto
    async addProduct({ title, description, price, thumbnail, code, stock }) {
        const products = await this.readFile();

        // Verificar si el código del producto ya existe
        if (products.some(product => product.code === code)) {
            console.log(`Ya existe un producto con el código: '${code}'`);
            return null; // Si el producto existe, no lo agrega
        }

        // Validar datos del producto
        if (!title || !price) {
            console.log('Producto inválido:', { title, price });
            return null; // Si los campos requeridos no están presentes, no lo agrega
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
        console.log('Producto agregado y guardado:', newProduct); // Verifica que el producto se guarda
        await this.writeFile(products);
        return newProduct;
    }

    // Actualizar producto
    async updateProduct(id, { title, description, price, thumbnail, code, stock }) {
        const products = await this.readFile();
        id = parseInt(id, 10);
        const productIndex = products.findIndex(prod => prod.id === id);

        if (productIndex === -1) {
            console.log('Producto no encontrado');
            return null; // Si no se encuentra el producto, retorna null
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

    // Eliminar producto
    async deleteProduct(id) {
        const products = await this.readFile();
        id = parseInt(id, 10);

        const productIndex = products.findIndex(prod => prod.id === id);
        if (productIndex === -1) {
            console.log('Producto no encontrado');
            return null; // Si no se encuentra el producto, retorna null
        }

        const deletedProduct = products.splice(productIndex, 1)[0];
        await this.writeFile(products);
        return deletedProduct;
    }
}

module.exports = ProductManager;
