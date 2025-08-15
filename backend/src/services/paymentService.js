const { Connection, PublicKey, clusterApiUrl } = require('@solana/web3.js');
const crypto = require('crypto');

// Get the RPC URL with fallback to devnet for development
const rpcUrl = process.env.HELIUS_RPC_URL || clusterApiUrl('devnet');

// Create connection instance
const connection = new Connection(rpcUrl, 'confirmed');

// Payment tracking storage (in production, use Redis or database)
const paymentRequests = new Map();

// Export payment address (you should set this in environment variables)
// For devnet testing, you can use a test wallet address
const EXPORT_PAYMENT_ADDRESS = process.env.EXPORT_PAYMENT_ADDRESS || '11111111111111111111111111111111';

console.log(`Payment Service Configuration:`);
console.log(`- RPC URL: ${rpcUrl}`);
console.log(`- Network: ${rpcUrl.includes('devnet') ? 'Devnet' : 'Mainnet'}`);
console.log(`- Payment Address: ${EXPORT_PAYMENT_ADDRESS}`);
console.log(`- Environment: ${process.env.NODE_ENV || 'development'}`);

/**
 * Create a new payment request for export
 */
function createPaymentRequest(exportType, walletAddress, dateRange) {
  const requestId = crypto.randomUUID();
  const amount = 0.1; // 0.1 SOL
  
  const paymentRequest = {
    id: requestId,
    exportType,
    walletAddress,
    dateRange,
    amount,
    status: 'pending', // pending, paid, expired, failed
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes expiry
    paymentAddress: EXPORT_PAYMENT_ADDRESS,
    expectedAmount: amount * 1e9, // Convert to lamports
    transactionSignature: null
  };
  
  paymentRequests.set(requestId, paymentRequest);
  
  // Clean up expired requests
  setTimeout(() => {
    if (paymentRequests.has(requestId)) {
      const request = paymentRequests.get(requestId);
      if (request.status === 'pending' && new Date() > request.expiresAt) {
        request.status = 'expired';
        paymentRequests.set(requestId, request);
      }
    }
  }, 15 * 60 * 1000); // 15 minutes
  
  return paymentRequest;
}

/**
 * Check payment status for a request
 */
async function checkPaymentStatus(requestId) {
  const request = paymentRequests.get(requestId);
  if (!request) {
    throw new Error('Payment request not found');
  }
  
  if (request.status === 'paid') {
    return request;
  }
  
  if (new Date() > request.expiresAt) {
    request.status = 'expired';
    paymentRequests.set(requestId, request);
    return request;
  }
  
  // Check if payment was received
  try {
    const paymentAddress = new PublicKey(request.paymentAddress);
    const balance = await connection.getBalance(paymentAddress);
    
    // Check recent transactions to this address
    const signatures = await connection.getSignaturesForAddress(paymentAddress, { limit: 10 });
    
    for (const sig of signatures) {
      if (sig.blockTime * 1000 > request.createdAt.getTime()) {
        const tx = await connection.getTransaction(sig.signature, { maxSupportedTransactionVersion: 0 });
        
        if (tx && tx.meta && !tx.meta.err) {
          // Check if this transaction matches our expected amount
          const preBalance = tx.meta.preBalances[0] || 0;
          const postBalance = tx.meta.postBalances[0] || 0;
          const receivedAmount = postBalance - preBalance;
          
          if (receivedAmount >= request.expectedAmount) {
            request.status = 'paid';
            request.transactionSignature = sig.signature;
            request.paidAt = new Date();
            paymentRequests.set(requestId, request);
            return request;
          }
        }
      }
    }
  } catch (error) {
    console.error('Error checking payment status:', error);
  }
  
  return request;
}

/**
 * Get payment request by ID
 */
function getPaymentRequest(requestId) {
  return paymentRequests.get(requestId);
}

/**
 * Mark payment request as completed
 */
function markPaymentCompleted(requestId) {
  const request = paymentRequests.get(requestId);
  if (request) {
    request.status = 'completed';
    paymentRequests.set(requestId, request);
  }
  return request;
}

/**
 * Clean up old payment requests
 */
function cleanupOldRequests() {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  
  for (const [requestId, request] of paymentRequests.entries()) {
    if (request.createdAt < oneHourAgo && request.status !== 'pending') {
      paymentRequests.delete(requestId);
    }
  }
}

// Clean up old requests every hour
setInterval(cleanupOldRequests, 60 * 60 * 1000);

module.exports = {
  createPaymentRequest,
  checkPaymentStatus,
  getPaymentRequest,
  markPaymentCompleted,
  EXPORT_PAYMENT_ADDRESS
}; 