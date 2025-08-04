import React from 'react'
import { TrendingUp, TrendingDown, DollarSign, Activity, Loader2, Zap } from 'lucide-react'

const TransactionSummary = ({ transactions, isLoading, walletAddress, dateRange }) => {
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
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700'
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

  const calculateSummary = () => {
    if (!transactions.length) return null

    const summary = transactions.reduce((acc, tx) => {
      if (tx.type === 'buy') {
        acc.totalBought += tx.value
        acc.buyCount++
      } else if (tx.type === 'sell') {
        acc.totalSold += tx.value
        acc.sellCount++
      } else if (tx.type === 'swap') {
        acc.totalSwapped += tx.value
        acc.swapCount++
      } else if (tx.type === 'lp') {
        acc.totalLP += tx.value
        acc.lpCount++
      } else if (tx.type === 'airdrop') {
        acc.totalAirdrops += tx.value
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

    summary.netGain = summary.totalSold - summary.totalBought
    return summary
  }

  const summary = calculateSummary()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Fetching transaction history...
            </p>
          </div>
        </div>
        
        {/* Loading skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!transactions.length) {
    return (
      <div className="text-center py-12">
        <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No transactions found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          No transactions were found for the selected wallet and date range.
        </p>
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
                  {transactions.map((tx) => (
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