require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const urlRoutes = require('./routes/urlRoutes');
const Url = require('./models/Url');
const { redirectLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/urls', urlRoutes);

app.get('/:shortCode', redirectLimiter, async (req, res) => {
  try {
    const { shortCode } = req.params;

    if (shortCode === 'api' || shortCode === 'favicon.ico') {
      return res.status(404).json({ error: 'Not found.' });
    }

    const url = await Url.findOneAndUpdate(
      { shortCode: shortCode.toLowerCase() },
      {
        $inc: { clicks: 1 },
        $push: { clickHistory: { clickedAt: new Date() } },
      },
      { new: true }
    );

    if (!url) {
      return res.status(404).json({ error: 'Short URL not found.' });
    }

    return res.redirect(url.originalUrl);
  } catch (error) {
    console.error('Redirect error:', error);
    return res.status(500).json({ error: 'Server error during redirect.' });
  }
});

async function startServer() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/url-shortener';

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
