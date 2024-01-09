const mongoose = require('mongoose');

module.exports = mongoose.model('product', new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 80,
        uppercase: true,
        required: true
    },
    desc: {
        type: String,
        trim: true,
        maxlength: 500,
        required: true,
    },
    img: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    category: {
        type: String,
        minlength: 2,
        maxlength: 20,
        lowercase: true,
        required: true
    },
    size: {
        type: String,
        minlength: 2,
        maxlength: 20,
        enum: ['small', 'medium', 'large'],
        lowercase: true,
        required: true
    },
    instock: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, { timestamps: true, versionKey: false }));