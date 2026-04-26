const express = require('express');
const Message = require('../models/Message');
const Item = require('../models/Item');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/chat/:itemId — owner fetches all messages
router.get('/:itemId', protect, async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.itemId, owner: req.user._id });
    if (!item) return res.status(403).json({ error: 'Not authorized' });

    const messages = await Message.find({ item: req.params.itemId }).sort('createdAt');
    await Message.updateMany(
      { item: req.params.itemId, sender: 'finder', isRead: false },
      { isRead: true }
    );
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/chat/:itemId/owner — owner sends message
router.post('/:itemId/owner', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Message text required' });

    const item = await Item.findOne({ _id: req.params.itemId, owner: req.user._id });
    if (!item) return res.status(403).json({ error: 'Not authorized' });

    const message = await Message.create({
      item: req.params.itemId,
      sender: 'owner',
      text
    });
    res.status(201).json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/chat/:itemId/finder — finder sends message (no auth needed)
router.post('/:itemId/finder', async (req, res) => {
  try {
    const { text, sessionId } = req.body;
    if (!text) return res.status(400).json({ error: 'Message text required' });

    const item = await Item.findById(req.params.itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const message = await Message.create({
      item: req.params.itemId,
      sender: 'finder',
      text,
      finderSessionId: sessionId || 'anonymous'
    });
    res.status(201).json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/chat/:itemId/finder — finder polls messages
router.get('/:itemId/finder', async (req, res) => {
  try {
    const messages = await Message.find({ item: req.params.itemId }).sort('createdAt');
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
