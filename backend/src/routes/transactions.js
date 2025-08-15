const express = require('express');
const router = express.Router();
const { getTransactionHistory, getWalletBalance, testConnection } = require('../services/solanaService');
const { validateWalletAddress } = require('../middleware/validation');

/**
 * GET /api/transactions/test
 * Test endpoint for development
 */
router.get('/test', async (req, res) => {
  try {
    const connectionTest = await testConnection();
    res.json({
      success: true,
      message: 'Transaction API is working',
      timestamp: new Date().toISOString(),
      connectionTest,
      endpoints: {
        'GET /:address': 'Get transaction history',
        'GET /:address/summary': 'Get transaction summary',
        'GET /:address/comprehensive': 'Get comprehensive data'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Connection test failed',
      message: error.message
    });
  }
});

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
 * GET /api/transactions/:address/comprehensive
 * Get comprehensive transaction data including balance and summary
 */
router.get('/:address/comprehensive', validateWalletAddress, async (req, res) => {
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

    // Get transaction history and wallet balance in parallel
    const [transactions, balance] = await Promise.all([
      getTransactionHistory(address, start, end),
      getWalletBalance(address).catch(() => 0) // Don't fail if balance fetch fails
    ]);
    console.log(balance);
    const summary = calculateTransactionSummary(transactions);

    res.json({
      success: true,
      data: {
        address,
        balance,
        dateRange: { startDate: start, endDate: end },
        transactions,
        summary,
        count: transactions.length,
        // Additional metadata
        metadata: {
          generatedAt: new Date().toISOString(),
          totalFees: summary.totalFees,
          averageTransactionValue: transactions.length > 0 ? summary.totalValue / transactions.length : 0
        }
      }
    });

  } catch (error) {
    console.error('Error fetching comprehensive transaction data:', error);
    res.status(500).json({
      error: 'Failed to fetch comprehensive transaction data',
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
    totalValue: 0,
    // Frontend-specific summary
    totalBought: 0,
    totalSold: 0,
    totalSwapped: 0,
    totalLP: 0,
    totalAirdrops: 0,
    buyCount: 0,
    sellCount: 0,
    swapCount: 0,
    lpCount: 0,
    airdropCount: 0,
    // Token-specific summaries
    tokens: {}
  };

  // Group by transaction type and calculate values
  transactions.forEach(tx => {
    // Count by type
    summary.byType[tx.type] = (summary.byType[tx.type] || 0) + 1;
    
    if (tx.token) {
      summary.byToken[tx.token] = (summary.byToken[tx.token] || 0) + 1;
      
      // Initialize token summary if not exists
      if (!summary.tokens[tx.token]) {
        summary.tokens[tx.token] = {
          totalBought: 0,
          totalSold: 0,
          totalSwapped: 0,
          buyCount: 0,
          sellCount: 0,
          swapCount: 0,
          totalAmount: 0
        };
      }
    }

    // Calculate values based on transaction type
    const value = tx.value || 0;
    summary.totalValue += value;

    // Debug logging for transaction values
    console.log(`Transaction ${tx.id}: type=${tx.type}, token=${tx.token}, amount=${tx.amount}, price=${tx.price}, value=${value}`);

    switch (tx.type) {
      case 'buy':
        summary.totalBought += value;
        summary.buyCount++;
        if (tx.token && summary.tokens[tx.token]) {
          summary.tokens[tx.token].totalBought += value;
          summary.tokens[tx.token].buyCount++;
          summary.tokens[tx.token].totalAmount += tx.amount || 0;
        }
        break;
      case 'sell':
        summary.totalSold += value;
        summary.sellCount++;
        if (tx.token && summary.tokens[tx.token]) {
          summary.tokens[tx.token].totalSold += value;
          summary.tokens[tx.token].sellCount++;
          summary.tokens[tx.token].totalAmount += tx.amount || 0;
        }
        break;
      case 'swap':
        summary.totalSwapped += value;
        summary.swapCount++;
        if (tx.token && summary.tokens[tx.token]) {
          summary.tokens[tx.token].totalSwapped += value;
          summary.tokens[tx.token].swapCount++;
          summary.tokens[tx.token].totalAmount += tx.amount || 0;
        }
        break;
      case 'lp':
        summary.totalLP += value;
        summary.lpCount++;
        break;
      case 'airdrop':
        summary.totalAirdrops += value;
        summary.airdropCount++;
        break;
    }
  });

  // Calculate net gain/loss
  summary.netGain = summary.totalSold - summary.totalBought;
  summary.totalVolume = summary.totalBought + summary.totalSold + summary.totalSwapped;

  // Debug logging for final summary
  console.log('Final summary calculation:', {
    totalBought: summary.totalBought,
    totalSold: summary.totalSold,
    totalSwapped: summary.totalSwapped,
    totalLP: summary.totalLP,
    totalAirdrops: summary.totalAirdrops,
    netGain: summary.netGain,
    totalVolume: summary.totalVolume
  });

  return summary;
}

module.exports = router; 