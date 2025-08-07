const express = require('express');
const router = express.Router();
const { generateCSV } = require('../services/csvService');
const { generatePDF } = require('../services/pdfService');
const { getTransactionHistory } = require('../services/solanaService');
const { validateWalletAddress } = require('../middleware/validation');

/**
 * POST /api/exports/csv
 * Generate CSV export for transaction history
 */
router.post('/csv', validateWalletAddress, async (req, res) => {
  try {
    const { address, startDate, endDate } = req.body;

    if (!address || !startDate || !endDate) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'address, startDate, and endDate are required'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Fetch transaction history
    const transactions = await getTransactionHistory(address, start, end);

    if (transactions.length === 0) {
      return res.status(404).json({
        error: 'No transactions found',
        message: 'No transactions found for the specified date range'
      });
    }

    // Generate CSV
    const csvBuffer = await generateCSV(transactions, {
      address,
      startDate: start,
      endDate: end
    });

    // Set response headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="solana-transactions-${address}-${startDate}-${endDate}.csv"`);
    res.setHeader('Content-Length', csvBuffer.length);

    res.send(csvBuffer);

  } catch (error) {
    console.error('Error generating CSV export:', error);
    res.status(500).json({
      error: 'Failed to generate CSV export',
      message: error.message
    });
  }
});

/**
 * POST /api/exports/pdf
 * Generate PDF export for transaction history
 */
router.post('/pdf', validateWalletAddress, async (req, res) => {
  try {
    const { address, startDate, endDate } = req.body;

    if (!address || !startDate || !endDate) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'address, startDate, and endDate are required'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Fetch transaction history
    const transactions = await getTransactionHistory(address, start, end);

    if (transactions.length === 0) {
      return res.status(404).json({
        error: 'No transactions found',
        message: 'No transactions found for the specified date range'
      });
    }

    // Generate PDF
    const pdfBuffer = await generatePDF(transactions, {
      address,
      startDate: start,
      endDate: end
    });

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="solana-transactions-${address}-${startDate}-${endDate}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating PDF export:', error);
    res.status(500).json({
      error: 'Failed to generate PDF export',
      message: error.message
    });
  }
});

/**
 * GET /api/exports/preview/:address
 * Get a preview of the export data
 */
router.get('/preview/:address', validateWalletAddress, async (req, res) => {
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

    // Fetch transaction history
    const transactions = await getTransactionHistory(address, start, end);

    // Get preview data (first 10 transactions)
    const preview = transactions.slice(0, 10);

    res.json({
      success: true,
      data: {
        address,
        dateRange: { startDate: start, endDate: end },
        preview,
        totalCount: transactions.length,
        estimatedSize: {
          csv: `${Math.round(transactions.length * 0.5)}KB`,
          pdf: `${Math.round(transactions.length * 2)}KB`
        }
      }
    });

  } catch (error) {
    console.error('Error generating export preview:', error);
    res.status(500).json({
      error: 'Failed to generate export preview',
      message: error.message
    });
  }
});

module.exports = router; 