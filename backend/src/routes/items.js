const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Item = require('../models/Item');
const { protect } = require('../middleware/auth');
const { generateQR } = require('../utils/qrGenerator');

const router = express.Router();

// GET /api/items — owner's items
router.get('/', protect, async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user._id }).sort('-createdAt');
    res.json({ items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/items — register new item
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, category, rewardAmount, color } = req.body;
    if (!name) return res.status(400).json({ error: 'Item name required' });

    const uniqueCode = uuidv4();
    const { qrDataUrl, scanUrl } = await generateQR(uniqueCode);

    const item = await Item.create({
      owner: req.user._id,
      name,
      description,
      category: category || 'other',
      uniqueCode,
      qrCodeUrl: qrDataUrl,
      rewardAmount: rewardAmount || 0,
      color: color || '#6366f1'
    });

    res.status(201).json({ item, scanUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/items/:id — single item
router.get('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, owner: req.user._id });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json({ item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/items/:id — update item
router.put('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { $set: req.body },
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json({ item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/items/:id — delete item
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/items/:id/stats — scan stats
router.get('/:id/stats', protect, async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, owner: req.user._id });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json({
      totalScans: item.scanHistory.length,
      lastScan: item.scanHistory[item.scanHistory.length - 1] || null,
      status: item.status
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
