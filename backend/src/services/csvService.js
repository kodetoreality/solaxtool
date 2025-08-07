const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const moment = require('moment');

/**
 * Generate CSV export for transaction history
 */
async function generateCSV(transactions, options) {
  const { address, startDate, endDate } = options;

  // Define CSV headers for tax-friendly format
  const headers = [
    { id: 'date', title: 'Date' },
    { id: 'time', title: 'Time' },
    { id: 'type', title: 'Transaction Type' },
    { id: 'token', title: 'Token' },
    { id: 'amount', title: 'Amount' },
    { id: 'price', title: 'Price (USD)' },
    { id: 'value', title: 'Value (USD)' },
    { id: 'fee', title: 'Fee (SOL)' },
    { id: 'signature', title: 'Transaction Hash' },
    { id: 'from', title: 'From Address' },
    { id: 'to', title: 'To Address' },
    { id: 'status', title: 'Status' },
    { id: 'notes', title: 'Notes' }
  ];

  // Transform transactions for CSV format
  const csvData = transactions.map(tx => ({
    date: moment(tx.blockTime * 1000).format('YYYY-MM-DD'),
    time: moment(tx.blockTime * 1000).format('HH:mm:ss'),
    type: categorizeTransactionType(tx.type),
    token: tx.token || 'SOL',
    amount: formatAmount(tx.amount),
    price: formatPrice(tx.price),
    value: formatPrice(tx.value),
    fee: formatFee(tx.fee),
    signature: tx.signature,
    from: tx.from || '',
    to: tx.to || '',
    status: tx.status,
    notes: generateNotes(tx)
  }));

  // Add summary information
  const summary = calculateSummary(transactions);
  const summaryRows = generateSummaryRows(summary, address, startDate, endDate);

  // Combine data and summary
  const finalData = [...csvData, ...summaryRows];

  // Create CSV content
  const csvContent = createCSVContent(headers, finalData);

  return Buffer.from(csvContent, 'utf8');
}

/**
 * Categorize transaction type for tax purposes
 */
function categorizeTransactionType(type) {
  const typeMap = {
    'buy': 'Purchase',
    'sell': 'Sale',
    'swap': 'Swap',
    'transfer': 'Transfer',
    'liquidity': 'Liquidity',
    'airdrop': 'Airdrop',
    'stake': 'Staking',
    'unstake': 'Unstaking',
    'unknown': 'Other'
  };

  return typeMap[type] || 'Other';
}

/**
 * Format amount for CSV
 */
function formatAmount(amount) {
  if (!amount || amount === 0) return '0';
  return parseFloat(amount).toFixed(8);
}

/**
 * Format price for CSV
 */
function formatPrice(price) {
  if (!price || price === 0) return '0.00';
  return parseFloat(price).toFixed(2);
}

/**
 * Format fee for CSV
 */
function formatFee(fee) {
  if (!fee || fee === 0) return '0';
  return (fee / 1e9).toFixed(9); // Convert lamports to SOL
}

/**
 * Generate notes for transaction
 */
function generateNotes(tx) {
  const notes = [];
  
  if (tx.type === 'swap') {
    notes.push('DEX swap transaction');
  } else if (tx.type === 'liquidity') {
    notes.push('Liquidity pool activity');
  } else if (tx.type === 'airdrop') {
    notes.push('Token airdrop');
  }

  if (tx.status === 'failed') {
    notes.push('Transaction failed');
  }

  return notes.join('; ');
}

/**
 * Calculate summary statistics
 */
function calculateSummary(transactions) {
  const summary = {
    totalTransactions: transactions.length,
    successfulTransactions: transactions.filter(tx => tx.status === 'success').length,
    failedTransactions: transactions.filter(tx => tx.status === 'failed').length,
    totalFees: transactions.reduce((sum, tx) => sum + (tx.fee || 0), 0),
    totalValue: transactions.reduce((sum, tx) => sum + (tx.value || 0), 0),
    byType: {},
    byToken: {}
  };

  // Group by transaction type
  transactions.forEach(tx => {
    summary.byType[tx.type] = (summary.byType[tx.type] || 0) + 1;
    if (tx.token) {
      summary.byToken[tx.token] = (summary.byToken[tx.token] || 0) + 1;
    }
  });

  return summary;
}

/**
 * Generate summary rows for CSV
 */
function generateSummaryRows(summary, address, startDate, endDate) {
  const summaryRows = [
    {}, // Empty row
    { date: 'SUMMARY', time: '', type: 'REPORT SUMMARY', token: '', amount: '', price: '', value: '', fee: '', signature: '', from: '', to: '', status: '', notes: '' },
    { date: 'Wallet Address', time: address, type: '', token: '', amount: '', price: '', value: '', fee: '', signature: '', from: '', to: '', status: '', notes: '' },
    { date: 'Date Range', time: `${startDate.toDateString()} - ${endDate.toDateString()}`, type: '', token: '', amount: '', price: '', value: '', fee: '', signature: '', from: '', to: '', status: '', notes: '' },
    { date: 'Total Transactions', time: summary.totalTransactions.toString(), type: '', token: '', amount: '', price: '', value: '', fee: '', signature: '', from: '', to: '', status: '', notes: '' },
    { date: 'Successful Transactions', time: summary.successfulTransactions.toString(), type: '', token: '', amount: '', price: '', value: '', fee: '', signature: '', from: '', to: '', status: '', notes: '' },
    { date: 'Failed Transactions', time: summary.failedTransactions.toString(), type: '', token: '', amount: '', price: '', value: '', fee: '', signature: '', from: '', to: '', status: '', notes: '' },
    { date: 'Total Fees (SOL)', time: formatFee(summary.totalFees), type: '', token: '', amount: '', price: '', value: '', fee: '', signature: '', from: '', to: '', status: '', notes: '' },
    { date: 'Total Value (USD)', time: formatPrice(summary.totalValue), type: '', token: '', amount: '', price: '', value: '', fee: '', signature: '', from: '', to: '', status: '', notes: '' }
  ];

  return summaryRows;
}

/**
 * Create CSV content manually
 */
function createCSVContent(headers, data) {
  // Create header row
  const headerRow = headers.map(header => `"${header.title}"`).join(',');
  
  // Create data rows
  const dataRows = data.map(row => {
    return headers.map(header => {
      const value = row[header.id] || '';
      return `"${value}"`;
    }).join(',');
  });

  // Combine header and data
  return [headerRow, ...dataRows].join('\n');
}

module.exports = {
  generateCSV,
  categorizeTransactionType,
  formatAmount,
  formatPrice,
  formatFee,
  generateNotes,
  calculateSummary,
  generateSummaryRows,
  createCSVContent
}; 