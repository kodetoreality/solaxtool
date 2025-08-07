const express = require('express');
const router = express.Router();
const { validateWalletAddress: validateWallet, getWalletBalance } = require('../services/solanaService');
const { validateWalletAddress } = require('../middleware/validation');

/**
 * GET /api/wallets/:address/balance
 * Get wallet balance
 */
router.get('/:address/balance', validateWalletAddress, async (req, res) => {
  try {
    const { address } = req.params;

    // Get wallet balance
    const balance = await getWalletBalance(address);

    res.json({
      success: true,
      data: {
        address,
        balance,
        currency: 'SOL'
      }
    });

  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    res.status(500).json({
      error: 'Failed to fetch wallet balance',
      message: error.message
    });
  }
});

/**
 * POST /api/wallets/validate
 * Validate a wallet address
 */
router.post('/validate', async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        error: 'Missing wallet address',
        message: 'Wallet address is required'
      });
    }

    // Validate wallet address
    const isValid = await validateWallet(address);

    res.json({
      success: true,
      data: {
        address,
        isValid
      }
    });

  } catch (error) {
    console.error('Error validating wallet address:', error);
    res.status(500).json({
      error: 'Failed to validate wallet address',
      message: error.message
    });
  }
});

module.exports = router; 