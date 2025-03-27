const Product = require('./Product');

class ProductManager {
    async getProducts({ limit = 10, page = 1, sort, query = {} } = {}) {
        try {
            let filter = {};
            
            // Aplicar filtros si existen
            if (Object.keys(query).length > 0) {
                filter = { ...query };
            }

            // Configurar opciones de consulta
            const options = {
                limit: parseInt(limit),
                skip: (parseInt(page) - 1) * parseInt(limit),
                sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
            };

            // Ejecutar consulta
            const [products, total] = await Promise.all([
                Product.find(filter, null, options).lean(),
                Product.countDocuments(filter)
            ]);

            const totalPages = Math.ceil(total / limit);

            return {
                status: 'success',
                payload: products,
                totalPages,
                prevPage: page > 1 ? page - 1 : null,
                nextPage: page < totalPages ? page + 1 : null,
                page: parseInt(page),
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages,
                prevLink: page > 1 ? `?page=${page - 1}&limit=${limit}` : null,
                nextLink: page < totalPages ? `?page=${page + 1}&limit=${limit}` : null
            };
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const product = await Product.findById(id);
            return product || null;
        } catch (error) {
            console.error('Error al obtener producto por ID:', error);
            throw error;
        }
    }

    async addProduct(productData) {
        try {
            const existingProduct = await Product.findOne({ code: productData.code });
            if (existingProduct) {
                throw new Error(`Ya existe un producto con el código: ${productData.code}`);
            }

            const newProduct = new Product(productData);
            await newProduct.save();
            return newProduct;
        } catch (error) {
            console.error('Error al agregar producto:', error);
            throw error;
        }
    }

    async updateProduct(id, productData) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(
                id,
                productData,
                { new: true, runValidators: true }
            );
            return updatedProduct || null;
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(id);
            return deletedProduct || null;
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw error;
        }
    }
}

module.exports = ProductManager;
