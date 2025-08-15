const { Connection, PublicKey, clusterApiUrl, Commitment } = require('@solana/web3.js');
const { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, getAccount } = require('@solana/spl-token');
const axios = require('axios');

// Get the RPC URL with fallback to devnet for development
const rpcUrl = process.env.HELIUS_RPC_URL || clusterApiUrl('devnet');

console.log(`Environment variables:`);
console.log(`- HELIUS_RPC_URL: ${process.env.HELIUS_RPC_URL ? 'Set' : 'Not set'}`);
console.log(`- Using RPC URL: ${rpcUrl}`);
console.log(`- Network: ${rpcUrl.includes('devnet') ? 'Devnet' : 'Mainnet'}`);
console.log(`- Environment: ${process.env.NODE_ENV || 'development'}`);

// Create connection instance with proper configuration
const connection = new Connection(
  rpcUrl,
  {
    commitment: 'confirmed',
    confirmTransactionInitialTimeout: 60000
  }
);

// Common token mint addresses
const TOKEN_MINTS = {
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 'USDC',
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': 'USDT',
  'So11111111111111111111111111111111111111112': 'SOL',
  'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So': 'mSOL',
  '7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj': 'stSOL',
  'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': 'BONK',
  '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr': 'POPCAT',
  '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R': 'RAY',
  'AFbX8oGjGpmVFywbVouvhQSRmiW2aR1mohfahi4Y2AdB': 'GST',
  '7i5KKsX2weiTkry7jA4ZwSuXGhs5eJBEjY8vVxRzf5Mp': 'GMT'
};

// Default token prices (USD) - these will be used as fallbacks
const DEFAULT_TOKEN_PRICES = {
  'USDC': 1.0,
  'USDT': 1.0,
  'SOL': 100.0, // Approximate current SOL price
  'mSOL': 100.0,
  'stSOL': 100.0,
  'BONK': 0.00001, // Approximate current BONK price
  'POPCAT': 0.001, // Approximate current POPCAT price
  'RAY': 0.5, // Approximate current RAY price
  'GST': 0.01, // Approximate current GST price
  'GMT': 0.3, // Approximate current GMT price
  'Unknown Token': 0.0
};

/**
 * Test the connection to make sure it's working
 */
async function testConnection() {
  try {
    const slot = await connection.getSlot('confirmed');
    console.log(`Connection test successful. Current slot: ${slot}`);
    return true;
  } catch (error) {
    console.error('Connection test failed:', error.message);
    return false;
  }
}

// Test the connection on startup
testConnection().catch(console.error);

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
    const balance = await connection.getBalance(publicKey, 'confirmed');
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
    
    console.log(`Fetching transactions for address: ${address}`);
    console.log(`Date range: ${startDate.toISOString()} to ${endDate.toISOString()}`);
    
    // Get all signatures for the wallet with explicit commitment
    const signatures = await connection.getSignaturesForAddress(
      publicKey,
      { limit: 1000 },
      'confirmed'
    );

    console.log(`Found ${signatures.length} signatures`);

    // Filter signatures by date range
    const filteredSignatures = signatures.filter(sig => {
      const txDate = new Date(sig.blockTime * 1000);
      return txDate >= startDate && txDate <= endDate;
    });

    console.log(`Filtered to ${filteredSignatures.length} signatures in date range`);

    // Fetch transaction details
    const transactions = await Promise.all(
      filteredSignatures.map(async (sig) => {
        try {
          const tx = await connection.getTransaction(sig.signature, {
            maxSupportedTransactionVersion: 0,
            commitment: 'confirmed'
          });
          return parseTransaction(tx, sig, address);
        } catch (error) {
          console.warn(`Failed to fetch transaction ${sig.signature}:`, error.message);
          return null;
        }
      })
    );

    const validTransactions = transactions.filter(tx => tx !== null);
    console.log(`Successfully parsed ${validTransactions.length} transactions`);

    return validTransactions;
  } catch (error) {
    console.error('Error in getTransactionHistory:', error);
    throw new Error(`Failed to fetch transaction history: ${error.message}`);
  }
}

/**
 * Parse transaction and categorize it
 */
function parseTransaction(transaction, signatureInfo, walletAddress) {
  if (!transaction || !transaction.meta) {
    return null;
  }

  const tx = {
    id: signatureInfo.signature,
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
    programId: '',
    date: new Date(signatureInfo.blockTime * 1000).toISOString().split('T')[0],
    txHash: signatureInfo.signature
  };

  // Parse transaction instructions
  if (transaction.transaction.message.instructions) {
    for (const instruction of transaction.transaction.message.instructions) {
      const programId = transaction.transaction.message.accountKeys[instruction.programIdIndex];
      
      // Categorize based on program ID
      if (programId.equals(TOKEN_PROGRAM_ID)) {
        const tokenInfo = categorizeTokenTransaction(instruction, transaction, walletAddress);
        if (tokenInfo) {
          Object.assign(tx, tokenInfo);
        }
      } else if (isSwapTransaction(programId)) {
        tx.type = 'swap';
        // Try to determine the token from the transaction
        const swapInfo = categorizeSwapTransaction(transaction, walletAddress);
        if (swapInfo) {
          Object.assign(tx, swapInfo);
        } else {
          tx.token = 'SOL'; // Default for swaps
          tx.price = DEFAULT_TOKEN_PRICES['SOL'];
          tx.value = (tx.amount || 0) * DEFAULT_TOKEN_PRICES['SOL'];
        }
      } else if (isLiquidityTransaction(programId)) {
        tx.type = 'lp';
        tx.token = 'SOL'; // Default for LP
        tx.price = DEFAULT_TOKEN_PRICES['SOL'];
        tx.value = (tx.amount || 0) * DEFAULT_TOKEN_PRICES['SOL'];
      } else if (isAirdropTransaction(transaction)) {
        tx.type = 'airdrop';
        const airdropInfo = categorizeAirdropTransaction(transaction, walletAddress);
        if (airdropInfo) {
          Object.assign(tx, airdropInfo);
        } else {
          tx.token = 'SOL'; // Default for airdrops
          tx.price = DEFAULT_TOKEN_PRICES['SOL'];
          tx.value = (tx.amount || 0) * DEFAULT_TOKEN_PRICES['SOL'];
        }
      }
    }
  }

  // If no specific type was determined, try to categorize based on SOL transfers
  if (tx.type === 'unknown') {
    const solTransfer = categorizeSolTransfer(transaction, walletAddress);
    if (solTransfer) {
      Object.assign(tx, solTransfer);
    }
  }

  // Calculate value if we have amount and price, or use default price as fallback
  if (tx.amount) {
    if (tx.price && tx.price > 0) {
      tx.value = tx.amount * tx.price;
    } else {
      // Use default price as fallback
      const tokenSymbol = tx.token || 'SOL';
      const defaultPrice = DEFAULT_TOKEN_PRICES[tokenSymbol] || DEFAULT_TOKEN_PRICES['Unknown Token'];
      tx.price = defaultPrice;
      tx.value = tx.amount * defaultPrice;
    }
  }

  return tx;
}

/**
 * Categorize SOL transfers
 */
function categorizeSolTransfer(transaction, walletAddress) {
  if (!transaction.meta || !transaction.transaction.message) {
    return null;
  }

  const preBalances = transaction.meta.preBalances;
  const postBalances = transaction.meta.postBalances;
  const accountKeys = transaction.transaction.message.accountKeys;

  // Find the wallet's account index
  const walletIndex = accountKeys.findIndex(key => key.toBase58() === walletAddress);
  if (walletIndex === -1) return null;

  const preBalance = preBalances[walletIndex] || 0;
  const postBalance = postBalances[walletIndex] || 0;
  const balanceChange = (postBalance - preBalance) / 1e9; // Convert to SOL

  if (Math.abs(balanceChange) < 0.000001) return null; // Ignore dust amounts

  return {
    type: balanceChange > 0 ? 'buy' : 'sell',
    amount: Math.abs(balanceChange),
    token: 'SOL',
    price: DEFAULT_TOKEN_PRICES['SOL'], // Use default SOL price
    value: Math.abs(balanceChange) * DEFAULT_TOKEN_PRICES['SOL']
  };
}

/**
 * Categorize token transactions (SPL tokens)
 */
function categorizeTokenTransaction(instruction, transaction, walletAddress) {
  try {
    // Get token account info from the transaction
    const accountKeys = transaction.transaction.message.accountKeys;
    const preTokenBalances = transaction.meta.preTokenBalances || [];
    const postTokenBalances = transaction.meta.postTokenBalances || [];

    // Find token transfers involving the wallet
    const walletTokenChanges = [];
    
    // Check pre-token balances
    preTokenBalances.forEach(preBalance => {
      if (preBalance.owner === walletAddress) {
        const postBalance = postTokenBalances.find(post => 
          post.accountIndex === preBalance.accountIndex
        );
        
        if (postBalance) {
          const preAmount = parseFloat(preBalance.uiTokenAmount.uiAmount || 0);
          const postAmount = parseFloat(postBalance.uiTokenAmount.uiAmount || 0);
          const change = postAmount - preAmount;
          
          if (Math.abs(change) > 0.000001) { // Ignore dust amounts
            walletTokenChanges.push({
              mint: preBalance.mint,
              change,
              preAmount,
              postAmount
            });
          }
        }
      }
    });

    // Check post-token balances (for new tokens)
    postTokenBalances.forEach(postBalance => {
      if (postBalance.owner === walletAddress) {
        const preBalance = preTokenBalances.find(pre => 
          pre.accountIndex === postBalance.accountIndex
        );
        
        if (!preBalance) {
          // New token account
          const amount = parseFloat(postBalance.uiTokenAmount.uiAmount || 0);
          if (amount > 0.000001) {
            walletTokenChanges.push({
              mint: postBalance.mint,
              change: amount,
              preAmount: 0,
              postAmount: amount
            });
          }
        }
      }
    });

    if (walletTokenChanges.length === 0) {
      return null;
    }

    // Determine transaction type and token
    const tokenChange = walletTokenChanges[0]; // Take the first significant change
    const tokenSymbol = TOKEN_MINTS[tokenChange.mint] || 'Unknown Token';
    const defaultPrice = DEFAULT_TOKEN_PRICES[tokenSymbol] || DEFAULT_TOKEN_PRICES['Unknown Token'];
    
    return {
      type: tokenChange.change > 0 ? 'buy' : 'sell',
      amount: Math.abs(tokenChange.change),
      token: tokenSymbol,
      tokenMint: tokenChange.mint,
      price: defaultPrice, // Use default price
      value: Math.abs(tokenChange.change) * defaultPrice
    };
  } catch (error) {
    console.warn('Error categorizing token transaction:', error);
    return null;
  }
}

/**
 * Categorize swap transactions
 */
function categorizeSwapTransaction(transaction, walletAddress) {
  try {
    // Look for token balance changes in swap transactions
    const preTokenBalances = transaction.meta.preTokenBalances || [];
    const postTokenBalances = transaction.meta.postTokenBalances || [];
    
    const walletTokenChanges = [];
    
    preTokenBalances.forEach(preBalance => {
      if (preBalance.owner === walletAddress) {
        const postBalance = postTokenBalances.find(post => 
          post.accountIndex === preBalance.accountIndex
        );
        
        if (postBalance) {
          const preAmount = parseFloat(preBalance.uiTokenAmount.uiAmount || 0);
          const postAmount = parseFloat(postBalance.uiTokenAmount.uiAmount || 0);
          const change = postAmount - preAmount;
          
          if (Math.abs(change) > 0.000001) {
            walletTokenChanges.push({
              mint: preBalance.mint,
              change,
              symbol: TOKEN_MINTS[preBalance.mint] || 'Unknown'
            });
          }
        }
      }
    });

    if (walletTokenChanges.length >= 2) {
      // This is a swap between two tokens
      const [token1, token2] = walletTokenChanges;
      const defaultPrice1 = DEFAULT_TOKEN_PRICES[token1.symbol] || DEFAULT_TOKEN_PRICES['Unknown Token'];
      const defaultPrice2 = DEFAULT_TOKEN_PRICES[token2.symbol] || DEFAULT_TOKEN_PRICES['Unknown Token'];
      
      return {
        type: 'swap',
        amount: Math.abs(token1.change),
        token: token1.symbol,
        swapTo: token2.symbol,
        swapToAmount: Math.abs(token2.change),
        price: defaultPrice1,
        value: Math.abs(token1.change) * defaultPrice1
      };
    }
    
    return null;
  } catch (error) {
    console.warn('Error categorizing swap transaction:', error);
    return null;
  }
}

/**
 * Categorize airdrop transactions
 */
function categorizeAirdropTransaction(transaction, walletAddress) {
  try {
    const postTokenBalances = transaction.meta.postTokenBalances || [];
    
    for (const postBalance of postTokenBalances) {
      if (postBalance.owner === walletAddress) {
        const preBalance = transaction.meta.preTokenBalances?.find(pre => 
          pre.accountIndex === postBalance.accountIndex
        );
        
        if (!preBalance) {
          // New token received (likely airdrop)
          const amount = parseFloat(postBalance.uiTokenAmount.uiAmount || 0);
          if (amount > 0.000001) {
            const tokenSymbol = TOKEN_MINTS[postBalance.mint] || 'Unknown Token';
            const defaultPrice = DEFAULT_TOKEN_PRICES[tokenSymbol] || DEFAULT_TOKEN_PRICES['Unknown Token'];
            
            return {
              type: 'airdrop',
              amount,
              token: tokenSymbol,
              tokenMint: postBalance.mint,
              price: defaultPrice,
              value: amount * defaultPrice
            };
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    console.warn('Error categorizing airdrop transaction:', error);
    return null;
  }
}

/**
 * Check if transaction is a swap
 */
function isSwapTransaction(programId) {
  const swapPrograms = [
    '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', // Orca
    '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8', // Raydium
    'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc', // Whirlpool
    'srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX', // Serum
    // Add more swap program IDs as needed
  ];
  return swapPrograms.includes(programId.toBase58());
}

/**
 * Check if transaction is liquidity related
 */
function isLiquidityTransaction(programId) {
  const lpPrograms = [
    '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8', // Raydium LP
    '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', // Orca LP
    // Add more LP program IDs as needed
  ];
  return lpPrograms.includes(programId.toBase58());
}

/**
 * Check if transaction is an airdrop
 */
function isAirdropTransaction(transaction) {
  // Look for common airdrop patterns
  if (transaction.meta && transaction.meta.logs) {
    const logs = transaction.meta.logs.join(' ').toLowerCase();
    return logs.includes('airdrop') || logs.includes('mint');
  }
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

/**
 * Update current token prices from CoinGecko API
 */
async function updateCurrentPrices() {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price',
      {
        params: {
          ids: 'solana,usd-coin,tether,bonk,raydium,stepn',
          vs_currencies: 'usd'
        },
        timeout: 10000
      }
    );

    // Update default prices with current market prices
    if (response.data.solana) {
      DEFAULT_TOKEN_PRICES['SOL'] = response.data.solana.usd;
      DEFAULT_TOKEN_PRICES['mSOL'] = response.data.solana.usd;
      DEFAULT_TOKEN_PRICES['stSOL'] = response.data.solana.usd;
    }
    if (response.data['usd-coin']) {
      DEFAULT_TOKEN_PRICES['USDC'] = response.data['usd-coin'].usd;
    }
    if (response.data.tether) {
      DEFAULT_TOKEN_PRICES['USDT'] = response.data.tether.usd;
    }
    if (response.data.bonk) {
      DEFAULT_TOKEN_PRICES['BONK'] = response.data.bonk.usd;
    }
    if (response.data.raydium) {
      DEFAULT_TOKEN_PRICES['RAY'] = response.data.raydium.usd;
    }
    if (response.data.stepn) {
      DEFAULT_TOKEN_PRICES['GST'] = response.data.stepn.usd;
    }

    console.log('Updated current token prices:', DEFAULT_TOKEN_PRICES);
  } catch (error) {
    console.warn('Failed to update current prices:', error.message);
    // Keep using default prices if update fails
  }
}

// Update prices every 5 minutes
setInterval(updateCurrentPrices, 5 * 60 * 1000);

// Initial price update
updateCurrentPrices().catch(console.error);

module.exports = {
  validateWalletAddress,
  getWalletBalance,
  getTransactionHistory,
  parseTransaction,
  categorizeTokenTransaction,
  isSwapTransaction,
  isLiquidityTransaction,
  isAirdropTransaction,
  getHistoricalPrice,
  updateCurrentPrices,
  testConnection
}; 