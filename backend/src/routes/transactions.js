const express = require('express');
const router = express.Router();
const { getTransactionHistory, validateWalletAddress: validateWallet } = require('../services/solanaService');
const { validateWalletAddress } = require('../middleware/validation');

/**
 * GET /api/transactions/:address
 * Get transaction history for a wallet address within date range
 */
router.get('/:address', validateWalletAddress, async (req, res) => {
  try {
    const { address } = req.params;
    const { startDate, endDate } = req.query;

    // Validate date parameters
    if (!startDate || !endDate) {
      return res.status(400).json({
        error: 'Missing required parameters',
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

    // Get transaction history
    const transactions = await getTransactionHistory(address, start, end);

    // Calculate summary statistics
    const summary = calculateTransactionSummary(transactions);

    res.json({
      success: true,
      data: {
        address,
        dateRange: { startDate: start, endDate: end },
        transactions,
        summary,
        count: transactions.length
      }
    });

  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      error: 'Failed to fetch transactions',
      message: error.message
    });
  }
});

/**
 * GET /api/transactions/:address/summary
 * Get transaction summary for a wallet address
 */
router.get('/:address/summary', validateWalletAddress, async (req, res) => {
  try {
    const { address } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'startDate and endDate are required'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const transactions = await getTransactionHistory(address, start, end);
    const summary = calculateTransactionSummary(transactions);

    res.json({
      success: true,
      data: {
        address,
        dateRange: { startDate: start, endDate: end },
        summary,
        count: transactions.length
      }
    });

  } catch (error) {
    console.error('Error fetching transaction summary:', error);
    res.status(500).json({
      error: 'Failed to fetch transaction summary',
      message: error.message
    });
  }
});

/**
 * Calculate transaction summary statistics
 */
function calculateTransactionSummary(transactions) {
  const summary = {
    totalTransactions: transactions.length,
    successfulTransactions: transactions.filter(tx => tx.status === 'success').length,
    failedTransactions: transactions.filter(tx => tx.status === 'failed').length,
    totalFees: transactions.reduce((sum, tx) => sum + (tx.fee || 0), 0),
    byType: {},
    byToken: {},
    totalValue: 0
  };

  // Group by transaction type
  transactions.forEach(tx => {
    summary.byType[tx.type] = (summary.byType[tx.type] || 0) + 1;
    
    if (tx.token) {
      summary.byToken[tx.token] = (summary.byToken[tx.token] || 0) + 1;
    }

    if (tx.value) {
      summary.totalValue += tx.value;
    }
  });

  return summary;
}

module.exports = router; 