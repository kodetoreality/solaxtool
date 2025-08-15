import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Activity, Loader2, Zap, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

const TransactionSummary = ({ transactions, isLoading, walletAddress, dateRange, summary: backendSummary }) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [transactionsPerPage] = useState(10)
  
  // Reset pagination when wallet address or transactions change
  useEffect(() => {
    setCurrentPage(1)
  }, [walletAddress, transactions])

  // Calculate pagination
  const indexOfLastTransaction = currentPage * transactionsPerPage
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction)
  const totalPages = Math.ceil(transactions.length / transactionsPerPage)

  // Pagination functions
  const goToPage = (page) => {
    setCurrentPage(page)
  }

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const goToFirstPage = () => {
    setCurrentPage(1)
  }

  const goToLastPage = () => {
    setCurrentPage(totalPages)
  }

  // Generate page numbers for display
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'buy':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'sell':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      case 'swap':
        return <Zap className="w-4 h-4 text-blue-500" />
      case 'lp':
        return <DollarSign className="w-4 h-4 text-purple-500" />
      case 'airdrop':
        return <DollarSign className="w-4 h-4 text-yellow-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-400" />
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'buy':
        return 'Buy'
      case 'sell':
        return 'Sell'
      case 'swap':
        return 'Swap'
      case 'lp':
        return 'LP'
      case 'airdrop':
        return 'Airdrop'
      default:
        return 'Other'
    }
  }

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'buy':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700'
      case 'sell':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-green-700'
      case 'swap':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700'
      case 'lp':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700'
      case 'airdrop':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700'
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600'
    }
  }

  // Use the backend summary if available, otherwise calculate locally as fallback
  const summary = backendSummary || (() => {
    if (!transactions.length) return null

    const localSummary = transactions.reduce((acc, tx) => {
      if (tx.type === 'buy') {
        acc.totalBought += tx.value || 0
        acc.buyCount++
      } else if (tx.type === 'sell') {
        acc.totalSold += tx.value || 0
        acc.sellCount++
      } else if (tx.type === 'swap') {
        acc.totalSwapped += tx.value || 0
        acc.swapCount++
      } else if (tx.type === 'lp') {
        acc.totalLP += tx.value || 0
        acc.lpCount++
      } else if (tx.type === 'airdrop') {
        acc.totalAirdrops += tx.value || 0
        acc.airdropCount++
      }
      return acc
    }, {
      totalBought: 0,
      totalSold: 0,
      totalSwapped: 0,
      totalLP: 0,
      totalAirdrops: 0,
      buyCount: 0,
      sellCount: 0,
      swapCount: 0,
      lpCount: 0,
      airdropCount: 0
    })

    localSummary.netGain = localSummary.totalSold - localSummary.totalBought
    return localSummary
  })()

  // Debug logging
  console.log('TransactionSummary received:', {
    transactionsCount: transactions.length,
    backendSummary: backendSummary,
    calculatedSummary: summary,
    sampleTransactions: transactions.slice(0, 3).map(tx => ({
      id: tx.id,
      type: tx.type,
      token: tx.token,
      amount: tx.amount,
      price: tx.price,
      value: tx.value
    }))
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-6 h-6 animate-spin text-purple-600 dark:text-purple-400" />
            <span className="text-lg text-gray-600 dark:text-gray-300">Loading transactions...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!transactions.length) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No transactions found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {walletAddress ? 'No transactions found for this wallet in the selected date range.' : 'Connect a wallet to view transactions.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Transaction Summary Cards */}
      {summary && (
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Transaction Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Total Bought Card */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-green-800 dark:text-green-300 mb-1">Total Bought</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 dark:text-green-400 mb-1 truncate">
                    ${summary.totalBought.toFixed(2)}
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-400">
                    {summary.buyCount} transaction{summary.buyCount !== 1 ? 's' : ''}
                  </p>
                </div>
                {/* <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-800/40 rounded-lg ml-3 flex-shrink-0">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                </div> */}
              </div>
            </div>

            {/* Total Sold Card */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-red-800 dark:text-red-300 mb-1">Total Sold</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600 dark:text-red-400 mb-1 truncate">
                    ${summary.totalSold.toFixed(2)}
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-400">
                    {summary.sellCount} transaction{summary.sellCount !== 1 ? 's' : ''}
                  </p>
                </div>
                {/* <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-red-100 dark:bg-red-800/40 rounded-lg ml-3 flex-shrink-0">
                  <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
                </div> */}
              </div>
            </div>

            {/* Net Gain/Loss Card */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Net Gain/Loss</p>
                  <p className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-1 truncate ${summary.netGain >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    ${summary.netGain.toFixed(2)}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    {summary.netGain >= 0 ? 'Profit' : 'Loss'}
                  </p>
                </div>
                {/* <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-800/40 rounded-lg ml-3 flex-shrink-0">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div> */}
              </div>
            </div>

            {/* Total Volume Card */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-purple-800 dark:text-purple-300 mb-1">Total Volume</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1 truncate">
                    ${(summary.totalBought + summary.totalSold + summary.totalSwapped).toFixed(2)}
                  </p>
                  <p className="text-xs text-purple-700 dark:text-purple-400">
                    {transactions.length} total transactions
                  </p>
                </div>
                {/* <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-800/40 rounded-lg ml-3 flex-shrink-0">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                </div> */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-0">
            Transaction History
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Token
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      TX Hash
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {currentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(tx.type)}
                          <span className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-full border ${getTypeBadgeClass(tx.type)}`}>
                            {getTypeLabel(tx.type)}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        {tx.token}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        {tx.amount.toFixed(4)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        ${tx.price.toFixed(2)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        ${tx.value.toFixed(2)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                        {new Date(tx.date).toLocaleDateString()}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <a
                          href={`https://solscan.io/tx/${tx.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-xs sm:text-sm font-mono transition-colors truncate block max-w-[120px] sm:max-w-none"
                          title={tx.txHash}
                        >
                          {tx.txHash}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-200 dark:border-gray-700 sm:px-5">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-600"
            >
              Previous
            </button>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-600"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">{indexOfFirstTransaction + 1}</span> to <span className="font-medium">{Math.min(indexOfLastTransaction, transactions.length)}</span> of{' '}
                <span className="font-medium">{transactions.length}</span> results
              </p>
            </div>
            <div className="flex items-center">
              <button
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ChevronsLeft className="h-5 w-5" />
              </button>
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {/* Page Numbers */}
              <div className="flex items-center space-x-1 mx-2">
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' && goToPage(page)}
                    disabled={page === '...'}
                    className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      page === currentPage
                        ? 'z-10 bg-purple-600 dark:bg-purple-500 text-white border-purple-600 dark:border-purple-500'
                        : page === '...'
                        ? 'text-gray-400 dark:text-gray-500 cursor-default'
                        : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ChevronsRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Additional Stats Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6">
            <h4 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">
              Other Activities
            </h4>
            <div className="space-y-2 sm:space-y-3">
              {summary.swapCount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Swaps:</span>
                  <span className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium">{summary.swapCount}</span>
                </div>
              )}
              {summary.lpCount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">LP Actions:</span>
                  <span className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 font-medium">{summary.lpCount}</span>
                </div>
              )}
              {summary.airdropCount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Airdrops:</span>
                  <span className="text-xs sm:text-sm text-yellow-600 dark:text-yellow-400 font-medium">{summary.airdropCount}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6">
            <h4 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">
              Date Range
            </h4>
            <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              <p className="break-words">{dateRange.startDate?.toLocaleDateString()} - {dateRange.endDate?.toLocaleDateString()}</p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
            <h4 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">
              Wallet Address
            </h4>
            <p className="text-xs font-mono text-gray-700 dark:text-gray-300 break-all">
              {walletAddress}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default TransactionSummary 