const { nanoid } = require('nanoid');

const ALIAS_PATTERN = /^[a-zA-Z0-9_-]{3,32}$/;

function generateShortCode() {
  return nanoid(8);
}

function validateCustomAlias(alias) {
  if (!alias || typeof alias !== 'string') {
    return { valid: false, error: 'Custom alias is required.' };
  }

  const trimmed = alias.trim();

  if (!ALIAS_PATTERN.test(trimmed)) {
    return {
      valid: false,
      error: 'Alias must be 3-32 characters and contain only letters, numbers, hyphens, or underscores.',
    };
  }

  return { valid: true, alias: trimmed.toLowerCase() };
}

module.exports = { generateShortCode, validateCustomAlias, ALIAS_PATTERN };
