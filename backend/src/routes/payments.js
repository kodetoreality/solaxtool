const express = require('express');
const router = express.Router();
const { createPaymentRequest, checkPaymentStatus, getPaymentRequest } = require('../services/paymentService');
const { validateWalletAddress } = require('../middleware/validation');

/**
 * POST /api/payments/export
 * Create a new payment request for export
 */
router.post('/export', validateWalletAddress, async (req, res) => {
  try {
    console.log('Payment export request received:', {
      body: req.body,
      walletAddress: req.walletAddress,
      headers: req.headers
    });

    const { exportType, walletAddress, dateRange } = req.body;

    if (!exportType || !walletAddress || !dateRange) {
      console.log('Missing required parameters:', { exportType, walletAddress, dateRange });
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'exportType, walletAddress, and dateRange are required'
      });
    }

    if (!['csv', 'pdf'].includes(exportType)) {
      return res.status(400).json({
        error: 'Invalid export type',
        message: 'exportType must be either "csv" or "pdf"'
      });
    }

    console.log('Creating payment request for:', { exportType, walletAddress, dateRange });
    const paymentRequest = createPaymentRequest(exportType, walletAddress, dateRange);

    res.json({
      success: true,
      data: {
        paymentRequest: {
          id: paymentRequest.id,
          amount: paymentRequest.amount,
          paymentAddress: paymentRequest.paymentAddress,
          status: paymentRequest.status,
          expiresAt: paymentRequest.expiresAt,
          exportType: paymentRequest.exportType
        }
      }
    });

  } catch (error) {
    console.error('Error creating payment request:', error);
    res.status(500).json({
      error: 'Failed to create payment request',
      message: error.message
    });
  }
});

/**
 * GET /api/payments/:requestId/status
 * Check payment status for a request
 */
router.get('/:requestId/status', async (req, res) => {
  try {
    const { requestId } = req.params;
    const paymentRequest = await checkPaymentStatus(requestId);

    if (!paymentRequest) {
      return res.status(404).json({
        error: 'Payment request not found',
        message: 'The payment request ID is invalid or expired'
      });
    }

    res.json({
      success: true,
      data: {
        paymentRequest: {
          id: paymentRequest.id,
          status: paymentRequest.status,
          amount: paymentRequest.amount,
          paymentAddress: paymentRequest.paymentAddress,
          expiresAt: paymentRequest.expiresAt,
          exportType: paymentRequest.exportType,
          transactionSignature: paymentRequest.transactionSignature,
          paidAt: paymentRequest.paidAt
        }
      }
    });

  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({
      error: 'Failed to check payment status',
      message: error.message
    });
  }
});

/**
 * GET /api/payments/:requestId
 * Get payment request details
 */
router.get('/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const paymentRequest = getPaymentRequest(requestId);

    if (!paymentRequest) {
      return res.status(404).json({
        error: 'Payment request not found',
        message: 'The payment request ID is invalid or expired'
      });
    }

    res.json({
      success: true,
      data: {
        paymentRequest: {
          id: paymentRequest.id,
          status: paymentRequest.status,
          amount: paymentRequest.amount,
          paymentAddress: paymentRequest.paymentAddress,
          expiresAt: paymentRequest.expiresAt,
          exportType: paymentRequest.exportType,
          walletAddress: paymentRequest.walletAddress,
          dateRange: paymentRequest.dateRange,
          createdAt: paymentRequest.createdAt,
          transactionSignature: paymentRequest.transactionSignature,
          paidAt: paymentRequest.paidAt
        }
      }
    });

  } catch (error) {
    console.error('Error getting payment request:', error);
    res.status(500).json({
      error: 'Failed to get payment request',
      message: error.message
    });
  }
});

module.exports = router; 