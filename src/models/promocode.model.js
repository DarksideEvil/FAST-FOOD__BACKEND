const { model, Schema } = require('mongoose');

module.exports = model('promocode', new Schema({
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage',
    },
    discountAmount: {
      type: Number,
      required: true,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    maxUses: {
      type: Number,
      default: null, // If null, there is no limit on the number of uses
    },
    currentUses: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
}, { versionKey: false, timestamps: true }));