const rateLimit = require('express-rate-limit');

const createUrlLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    error: 'Too many URLs created from this IP. Please try again in 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const redirectLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: {
    error: 'Too many redirect requests. Please try again shortly.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { createUrlLimiter, redirectLimiter };
