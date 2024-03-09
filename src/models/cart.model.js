const mongoose = require('mongoose');

module.exports = mongoose.model('cart', new mongoose.Schema({
    customer: {
        type: mongoose.Types.ObjectId,
        ref: 'customer',
        trim: true,
        required: true
    },
    products: {
        type: [{
            product: {
                type: mongoose.Types.ObjectId,
                ref: 'product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            size: {
                type: String,
                default: null
            },
            price: {
                type: Number,
                required: true
            },
            totalPrice: {
                type: Number,
                required: true
            }
        }],
        default: []
    },
    cartTotal: {
        type: Number,
        default: 0
    }
}, { timestamps: true, versionKey: false }));