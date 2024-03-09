const mongoose = require('mongoose');

module.exports = mongoose.model('order', new mongoose.Schema({
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'customer',
      trim: true,
    },
    products: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        ref: 'product',
        required: true
      },
      quantity: {
        type: Number,
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
      price: {
        type: Number,
        required: true
      },
      total: {
        type: Number,
      }
    }],
    subtotal: {
      type: Number,
    },
    tax: {
      type: Number,
    },
    total: {
      type: Number,
    },
    shippingAddress: {
      type: {
        type: String,
        enum: ['home', 'work', 'other'],
      },
      address: String,
      city: String,
      state: String,
      zipCode: String,
    },
    billingAddress: {
      type: {
        type: String,
        enum: ['home', 'work', 'other'],
        trim: true,
      },
      address: String,
      city: String,
      state: String,
      zipCode: String,
    },
    status: {
      type: String,
      trim: true,
      enum: ['new', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'new',
      lowercase: true,
      minlength: 2,
      maxlength: 20,
    },
    paymentStatus: {
      type: String,
      trim: true,
      enum: ['pending', 'paid', 'failed'],
      lowercase: true,
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      trim: true,
      enum: ['cash', 'credit card', 'debit card', 'paypal'],
      lowercase: true,
      required: true
    },
    trackingNumber: {
      type: String
    },
    trackingNumber: {
      type: String
    },
    discount: {
      type: Number,
      default: 0,
    }
}, { timestamps: true, versionKey: false }));