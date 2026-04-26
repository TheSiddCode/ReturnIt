const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const itemSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: {
    type: String,
    enum: ['wallet', 'keys', 'bag', 'laptop', 'phone', 'watch', 'other'],
    default: 'other'
  },
  uniqueCode: { type: String, default: uuidv4, unique: true },
  qrCodeUrl: { type: String, default: '' },
  status: {
    type: String,
    enum: ['active', 'lost', 'found', 'returned'],
    default: 'active'
  },
  rewardAmount: { type: Number, default: 0 },
  rewardCurrency: { type: String, default: 'INR' },
  scanHistory: [{
    scannedAt: { type: Date, default: Date.now },
    location: {
      lat: Number,
      lng: Number,
      city: String,
      address: String
    },
    finderMessage: String,
    finderContact: String,
    ipAddress: String
  }],
  isActive: { type: Boolean, default: true },
  color: { type: String, default: '#6366f1' },
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
