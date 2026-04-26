const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  sender: { type: String, enum: ['owner', 'finder'], required: true },
  text: { type: String, required: true },
  finderSessionId: { type: String },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
