const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        }
    }],
    total: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Middleware para calcular el total antes de guardar
cartSchema.pre('save', async function(next) {
    try {
        let total = 0;
        for (const item of this.products) {
            const product = await mongoose.model('Product').findById(item.product);
            if (product) {
                total += product.price * item.quantity;
            }
        }
        this.total = total;
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Cart', cartSchema); 