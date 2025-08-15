const { PublicKey } = require('@solana/web3.js');

/**
 * Validate Solana wallet address
 */
function validateWalletAddress(req, res, next) {
  // Check for wallet address in multiple possible fields
  const address = req.params.address || req.body.address || req.body.walletAddress;

  if (!address) {
    return res.status(400).json({
      error: 'Missing wallet address',
      message: 'Wallet address is required'
    });
  }

  try {
    const publicKey = new PublicKey(address);
    if (publicKey.toBase58() !== address) {
      throw new Error('Invalid address format');
    }
    req.walletAddress = address;
    next();
  } catch (error) {
    return res.status(400).json({
      error: 'Invalid wallet address',
      message: 'Please provide a valid Solana wallet address'
    });
  }
}

/**
 * Validate date range
 */
function validateDateRange(req, res, next) {
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    return res.status(400).json({
      error: 'Missing date parameters',
      message: 'startDate and endDate are required'
    });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({
      error: 'Invalid date format',
      message: 'Dates must be in ISO format (YYYY-MM-DD)'
    });
  }

  if (start > end) {
    return res.status(400).json({
      error: 'Invalid date range',
      message: 'startDate must be before endDate'
    });
  }

  // Check if date range is not too large (e.g., max 1 year)
  const daysDiff = (end - start) / (1000 * 60 * 60 * 24);
  if (daysDiff > 365) {
    return res.status(400).json({
      error: 'Date range too large',
      message: 'Date range cannot exceed 1 year'
    });
  }

  req.dateRange = { start, end };
  next();
}

/**
 * Validate export format
 */
function validateExportFormat(req, res, next) {
  const { format } = req.body;

  if (!format) {
    return res.status(400).json({
      error: 'Missing export format',
      message: 'Export format is required'
    });
  }

  const validFormats = ['csv', 'pdf'];
  if (!validFormats.includes(format.toLowerCase())) {
    return res.status(400).json({
      error: 'Invalid export format',
      message: 'Export format must be either "csv" or "pdf"'
    });
  }

  req.exportFormat = format.toLowerCase();
  next();
}

module.exports = {
  validateWalletAddress,
  validateDateRange,
  validateExportFormat
}; 