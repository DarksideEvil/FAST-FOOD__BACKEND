const mongoose = require('mongoose');

module.exports = mongoose.model('order', new mongoose.Schema({
    customer: {
      type: mongoose.Types.ObjectId,
      ref: 'customer',
      trim: true,
      required: true
    },
    products: [{
      product: {
        type: mongoose.Types.ObjectId,
        trim: true,
        ref: 'product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      total: {
        type: Number,
        required: true
      }
    }],
    subtotal: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    shippingAddress: {
      type: {
        type: String,
        enum: ['home', 'work', 'other'],
        required: true
      },
      address: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      zipCode: {
        type: String,
        required: true
      }
    },
    billingAddress: {
      type: {
        type: String,
        enum: ['home', 'work', 'other'],
        trim: true,
        required: true
      },
      address: {
        type: String,
        trim: true,
        required: true
      },
      city: {
        type: String,
        trim: true,
        required: true
      },
      state: {
        type: String,
        trim: true,
        required: true
      },
      zipCode: {
        type: String,
        trim: true,
        required: true
      }
    },
    status: {
      type: String,
      trim: true,
      enum: ['new', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'new',
      lowercase: true,
      minlength: 2,
      maxlength: 20,
      required: true
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
    }
}, { timestamps: true, versionKey: false }));