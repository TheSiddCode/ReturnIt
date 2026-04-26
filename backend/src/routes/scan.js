const express = require('express');
const Item = require('../models/Item');
const User = require('../models/User');
const { notifyOwner } = require('../utils/notifications');

const router = express.Router();

// GET /api/scan/:code — public — get item info for finder
router.get('/:code', async (req, res) => {
  try {
    const item = await Item.findOne({ uniqueCode: req.params.code, isActive: true })
      .populate('owner', 'name city trustScore');

    if (!item) return res.status(404).json({ error: 'Item not found or inactive' });

    // Return only safe public info
    res.json({
      item: {
        _id: item._id,
        name: item.name,
        description: item.description,
        category: item.category,
        status: item.status,
        rewardAmount: item.rewardAmount,
        color: item.color,
        ownerName: item.owner.name,
        ownerCity: item.owner.city,
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/scan/:code/report — finder sends message to owner
router.post('/:code/report', async (req, res) => {
  try {
    const { finderMessage, finderContact, lat, lng, address } = req.body;
    if (!finderMessage) return res.status(400).json({ error: 'Message is required' });

    const item = await Item.findOne({ uniqueCode: req.params.code, isActive: true })
      .populate('owner', 'name phone email');

    if (!item) return res.status(404).json({ error: 'Item not found' });

    const scanEntry = {
      scannedAt: new Date(),
      location: { lat, lng, address: address || 'Unknown location' },
      finderMessage,
      finderContact: finderContact || 'Anonymous',
      ipAddress: req.ip
    };

    item.scanHistory.push(scanEntry);
    if (item.status === 'active') item.status = 'found';
    await item.save();

    // Notify owner via WhatsApp
    await notifyOwner({
      ownerPhone: item.owner.phone,
      itemName: item.name,
      finderMessage,
      scanLocation: address || 'Unknown location'
    });

    res.json({
      success: true,
      message: 'Owner has been notified! They will contact you soon.',
      itemId: item._id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/scan/stats/heatmap — city heatmap data (public)
router.get('/stats/heatmap', async (req, res) => {
  try {
    const items = await Item.find({ 'scanHistory.0': { $exists: true } })
      .select('scanHistory');

    const points = [];
    items.forEach(item => {
      item.scanHistory.forEach(scan => {
        if (scan.location?.lat && scan.location?.lng) {
          points.push({ lat: scan.location.lat, lng: scan.location.lng });
        }
      });
    });

    res.json({ points });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
