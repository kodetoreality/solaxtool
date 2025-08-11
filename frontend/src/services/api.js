// API service for frontend-backend integration

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Make API request with error handling
 */
async function apiRequest(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Get transaction history for a wallet address
 */
export async function getTransactionHistory(address, startDate, endDate) {
  const params = new URLSearchParams({
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  });

  return apiRequest(`/transactions/${address}?${params}`);
}

/**
 * Get transaction summary for a wallet address
 */
export async function getTransactionSummary(address, startDate, endDate) {
  const params = new URLSearchParams({
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  });

  return apiRequest(`/transactions/${address}/summary?${params}`);
}

/**
 * Get comprehensive transaction data including balance and summary
 */
export async function getComprehensiveData(address, startDate, endDate) {
  const params = new URLSearchParams({
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  });

  return apiRequest(`/transactions/${address}/comprehensive?${params}`);
}

/**
 * Get wallet balance
 */
export async function getWalletBalance(address) {
  return apiRequest(`/wallets/${address}/balance`);
}

/**
 * Validate wallet address
 */
export async function validateWalletAddress(address) {
  return apiRequest('/wallets/validate', {
    method: 'POST',
    body: JSON.stringify({ address }),
  });
}

/**
 * Export transactions as CSV
 */
export async function exportCSV(address, startDate, endDate) {
  const params = new URLSearchParams({
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  });

  const response = await fetch(`${API_BASE_URL}/exports/csv`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      address,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `solana-transactions-${address}-${startDate.toISOString().split('T')[0]}-${endDate.toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

/**
 * Export transactions as PDF
 */
export async function exportPDF(address, startDate, endDate) {
  const response = await fetch(`${API_BASE_URL}/exports/pdf`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      address,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `solana-transactions-${address}-${startDate.toISOString().split('T')[0]}-${endDate.toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

/**
 * Test API connection
 */
export async function testAPI() {
  return apiRequest('/transactions/test');
} 