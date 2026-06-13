const express = require('express');
const validUrl = require('valid-url');
const Url = require('../models/Url');
const { generateShortCode, validateCustomAlias } = require('../utils/generateShortCode');
const { createUrlLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

function formatUrlResponse(urlDoc, baseUrl) {
  return {
    id: urlDoc._id,
    originalUrl: urlDoc.originalUrl,
    shortCode: urlDoc.shortCode,
    shortUrl: `${baseUrl}/${urlDoc.shortCode}`,
    clicks: urlDoc.clicks,
    clickHistory: urlDoc.clickHistory,
    createdAt: urlDoc.createdAt,
    updatedAt: urlDoc.updatedAt,
  };
}

router.post('/', createUrlLimiter, async (req, res) => {
  try {
    const { originalUrl, customAlias } = req.body;

    if (!originalUrl || !validUrl.isUri(originalUrl)) {
      return res.status(400).json({ error: 'A valid URL is required.' });
    }

    let shortCode;

    if (customAlias) {
      const validation = validateCustomAlias(customAlias);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }

      const existing = await Url.findOne({ shortCode: validation.alias });
      if (existing) {
        return res.status(409).json({ error: 'This custom alias is already taken.' });
      }

      shortCode = validation.alias;
    } else {
      let attempts = 0;
      do {
        shortCode = generateShortCode();
        const existing = await Url.findOne({ shortCode });
        if (!existing) break;
        attempts += 1;
      } while (attempts < 5);

      if (attempts >= 5) {
        return res.status(500).json({ error: 'Unable to generate a unique short code. Please try again.' });
      }
    }

    const url = await Url.create({ originalUrl, shortCode });
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;

    return res.status(201).json(formatUrlResponse(url, baseUrl));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'This custom alias is already taken.' });
    }
    console.error('Create URL error:', error);
    return res.status(500).json({ error: 'Server error while creating short URL.' });
  }
});

router.get('/', async (_req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    const baseUrl = process.env.BASE_URL || `${_req.protocol}://${_req.get('host')}`;

    return res.json(urls.map((url) => formatUrlResponse(url, baseUrl)));
  } catch (error) {
    console.error('List URLs error:', error);
    return res.status(500).json({ error: 'Server error while fetching URLs.' });
  }
});

router.get('/:shortCode', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortCode.toLowerCase() });

    if (!url) {
      return res.status(404).json({ error: 'Short URL not found.' });
    }

    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;

    return res.json(formatUrlResponse(url, baseUrl));
  } catch (error) {
    console.error('Get URL error:', error);
    return res.status(500).json({ error: 'Server error while fetching URL.' });
  }
});

module.exports = router;
