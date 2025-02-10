const fs = require('fs').promises;
const path = require('path');

class CartManager {
    constructor(filePath) {
        this.filePath = path.resolve(filePath);
    }

    async readFile() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.warn(`⚠️ Archivo no encontrado: ${this.filePath}. Creando uno nuevo.`);
                return [];
            }
            throw error;
        }
    }

    async writeFile(data) {
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2),'utf8');
    }

    async createCart() {
        const carts = await this.readFile();
        const newCart = {
            id: carts.length + 1,
            timestamp: Date.now(),
            products: [],
        };
        carts.push(newCart);
        await this.writeFile(carts);
        return newCart;
    }

    async getCartById(id) {
        const carts = await this.readFile();
        id = parseInt(id, 10);
        const cart = carts.find(c => c.id === id);
        return cart || null;
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.readFile();
        const cart = carts.find(cart => cart.id === parseInt(cartId, 10));

        if (!cart) return null;

        const productIndex = cart.products.findIndex(p => p.product === parseInt(productId, 10));

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: parseInt(productId, 10), quantity: 1 });
        }

        await this.writeFile(carts);
        return cart;
    }

} 
module.exports = CartManager;
