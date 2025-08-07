const { Connection, PublicKey, clusterApiUrl } = require('@solana/web3.js');
const { TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const axios = require('axios');

// Create connection instance
const connection = new Connection(
  process.env.HELIUS_RPC_URL || 
  process.env.SOLANA_RPC_URL || 
  clusterApiUrl('mainnet-beta'),
  'confirmed'
);

/**
 * Validate a Solana wallet address
 */
async function validateWalletAddress(address) {
  try {
    const publicKey = new PublicKey(address);
    return publicKey.toBase58() === address;
  } catch (error) {
    return false;
  }
}

/**
 * Get wallet balance
 */
async function getWalletBalance(address) {
  try {
    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    return balance / 1e9; // Convert lamports to SOL
  } catch (error) {
    throw new Error(`Failed to get wallet balance: ${error.message}`);
  }
}

/**
 * Fetch transaction history for a wallet within date range
 */
async function getTransactionHistory(address, startDate, endDate) {
  try {
    const publicKey = new PublicKey(address);
    
    // Get all signatures for the wallet
    const signatures = await connection.getSignaturesForAddress(
      publicKey,
      { limit: 1000 }
    );

    // Filter signatures by date range
    const filteredSignatures = signatures.filter(sig => {
      const txDate = new Date(sig.blockTime * 1000);
      return txDate >= startDate && txDate <= endDate;
    });

    // Fetch transaction details
    const transactions = await Promise.all(
      filteredSignatures.map(async (sig) => {
        try {
          const tx = await connection.getTransaction(sig.signature, {
            maxSupportedTransactionVersion: 0
          });
          return parseTransaction(tx, sig);
        } catch (error) {
          console.warn(`Failed to fetch transaction ${sig.signature}:`, error.message);
          return null;
        }
      })
    );

    return transactions.filter(tx => tx !== null);
  } catch (error) {
    throw new Error(`Failed to fetch transaction history: ${error.message}`);
  }
}

/**
 * Parse transaction and categorize it
 */
function parseTransaction(transaction, signatureInfo) {
  if (!transaction || !transaction.meta) {
    return null;
  }

  const tx = {
    signature: signatureInfo.signature,
    blockTime: signatureInfo.blockTime,
    slot: signatureInfo.slot,
    fee: transaction.meta.fee,
    status: transaction.meta.err ? 'failed' : 'success',
    type: 'unknown',
    amount: 0,
    token: 'SOL',
    price: 0,
    value: 0,
    from: '',
    to: '',
    programId: ''
  };

  // Parse transaction instructions
  if (transaction.transaction.message.instructions) {
    for (const instruction of transaction.transaction.message.instructions) {
      const programId = transaction.transaction.message.accountKeys[instruction.programIdIndex];
      
      // Categorize based on program ID
      if (programId.equals(TOKEN_PROGRAM_ID)) {
        tx.type = categorizeTokenTransaction(instruction, transaction);
      } else if (isSwapTransaction(programId)) {
        tx.type = 'swap';
      } else if (isLiquidityTransaction(programId)) {
        tx.type = 'liquidity';
      } else if (isAirdropTransaction(transaction)) {
        tx.type = 'airdrop';
      }
    }
  }

  return tx;
}

/**
 * Categorize token transactions
 */
function categorizeTokenTransaction(instruction, transaction) {
  // This is a simplified categorization - you'll need to implement
  // more sophisticated parsing based on your specific needs
  return 'transfer';
}

/**
 * Check if transaction is a swap
 */
function isSwapTransaction(programId) {
  const swapPrograms = [
    '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', // Orca
    '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8', // Raydium
    // Add more swap program IDs as needed
  ];
  return swapPrograms.includes(programId.toBase58());
}

/**
 * Check if transaction is liquidity related
 */
function isLiquidityTransaction(programId) {
  const lpPrograms = [
    // Add LP program IDs
  ];
  return lpPrograms.includes(programId.toBase58());
}

/**
 * Check if transaction is an airdrop
 */
function isAirdropTransaction(transaction) {
  // Implement airdrop detection logic
  return false;
}

/**
 * Get historical token price
 */
async function getHistoricalPrice(tokenAddress, timestamp) {
  try {
    // Use CoinGecko API for historical prices
    const date = new Date(timestamp * 1000).toISOString().split('T')[0];
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${tokenAddress}/history`,
      {
        params: { date },
        timeout: 5000
      }
    );
    
    return response.data.market_data?.current_price?.usd || 0;
  } catch (error) {
    console.warn(`Failed to get historical price for ${tokenAddress}:`, error.message);
    return 0;
  }
}

module.exports = {
  validateWalletAddress,
  getWalletBalance,
  getTransactionHistory,
  parseTransaction,
  categorizeTokenTransaction,
  isSwapTransaction,
  isLiquidityTransaction,
  isAirdropTransaction,
  getHistoricalPrice
}; 