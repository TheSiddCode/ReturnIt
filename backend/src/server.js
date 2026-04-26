require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const scanRoutes = require('./routes/scan');
const chatRoutes = require('./routes/chat');
const paymentRoutes = require('./routes/payments');

const app = express();

connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'TagBack API running' }));

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payments', paymentRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`TagBack server running on port ${PORT}`));
