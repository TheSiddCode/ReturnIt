const express = require('express');
const Item = require('../models/Item');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// POST /api/payments/create-order — owner creates reward payment
router.post('/create-order', protect, async (req, res) => {
  try {
    const { itemId, amount } = req.body;

    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'your_razorpay_key') {
      return res.json({
        devMode: true,
        message: 'Razorpay not configured. Add credentials to .env to enable payments.',
        orderId: 'dev_order_' + Date.now(),
        amount
      });
    }

    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET
    });

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `reward_${itemId}_${Date.now()}`
    });

    res.json({ orderId: order.id, amount, currency: 'INR' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/payments/mark-returned — mark item as returned
router.post('/mark-returned', protect, async (req, res) => {
  try {
    const { itemId, finderPhone } = req.body;

    const item = await Item.findOneAndUpdate(
      { _id: itemId, owner: req.user._id },
      { status: 'returned' },
      { new: true }
    );

    if (!item) return res.status(404).json({ error: 'Item not found' });

    // Increment owner's stats
    await User.findByIdAndUpdate(req.user._id, { $inc: { trustScore: 5 } });

    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
