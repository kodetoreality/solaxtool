import React from 'react'
import { TrendingUp, TrendingDown, DollarSign, Activity, Loader2 } from 'lucide-react'

const TransactionSummary = ({ transactions, isLoading, walletAddress, dateRange }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'buy':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'sell':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      case 'swap':
        return <Activity className="w-4 h-4 text-blue-500" />
      case 'lp':
        return <DollarSign className="w-4 h-4 text-purple-500" />
      case 'airdrop':
        return <DollarSign className="w-4 h-4 text-yellow-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
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

  const getTypeTagClass = (type) => {
    switch (type) {
      case 'buy':
        return 'tag tag-buy'
      case 'sell':
        return 'tag tag-sell'
      case 'swap':
        return 'tag tag-swap'
      case 'lp':
        return 'tag tag-lp'
      case 'airdrop':
        return 'tag tag-airdrop'
      default:
        return 'tag bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
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
            <Loader2 className="w-6 h-6 animate-spin text-primary-purple" />
            <p className="text-lg text-neutral-text-light dark:text-neutral-text-dark">
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
        <h3 className="text-lg font-medium text-neutral-text-light dark:text-neutral-text-dark mb-2">
          No transactions found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          No transactions were found for the selected wallet and date range.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">Total Bought</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  ${summary.totalBought.toFixed(2)}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {summary.buyCount} transaction{summary.buyCount !== 1 ? 's' : ''}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 dark:text-red-400">Total Sold</p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                  ${summary.totalSold.toFixed(2)}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">
                  {summary.sellCount} transaction{summary.sellCount !== 1 ? 's' : ''}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">Net Gain/Loss</p>
                <p className={`text-2xl font-bold ${summary.netGain >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                  ${summary.netGain.toFixed(2)}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  {summary.netGain >= 0 ? 'Profit' : 'Loss'}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="card bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400">Total Volume</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  ${(summary.totalBought + summary.totalSold + summary.totalSwapped).toFixed(2)}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  {transactions.length} total transactions
                </p>
              </div>
              <Activity className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>
      )}

      {/* Transaction Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-text-light dark:text-neutral-text-dark">
            Transaction History
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Token
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Price
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Value
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  TX Hash
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(tx.type)}
                      <span className={getTypeTagClass(tx.type)}>
                        {getTypeLabel(tx.type)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-neutral-text-light dark:text-neutral-text-dark">
                    {tx.token}
                  </td>
                  <td className="py-3 px-4 text-neutral-text-light dark:text-neutral-text-dark">
                    {tx.amount.toFixed(4)}
                  </td>
                  <td className="py-3 px-4 text-neutral-text-light dark:text-neutral-text-dark">
                    ${tx.price.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-medium text-neutral-text-light dark:text-neutral-text-dark">
                    ${tx.value.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <a
                      href={`https://solscan.io/tx/${tx.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-purple hover:text-primary-blue text-sm font-mono"
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

      {/* Additional Stats */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Other Activities
            </h4>
            <div className="space-y-2">
              {summary.swapCount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-text-light dark:text-neutral-text-dark">Swaps:</span>
                  <span className="text-blue-600 dark:text-blue-400">{summary.swapCount}</span>
                </div>
              )}
              {summary.lpCount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-text-light dark:text-neutral-text-dark">LP Actions:</span>
                  <span className="text-purple-600 dark:text-purple-400">{summary.lpCount}</span>
                </div>
              )}
              {summary.airdropCount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-text-light dark:text-neutral-text-dark">Airdrops:</span>
                  <span className="text-yellow-600 dark:text-yellow-400">{summary.airdropCount}</span>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Date Range
            </h4>
            <div className="text-sm text-neutral-text-light dark:text-neutral-text-dark">
              <p>{dateRange.startDate?.toLocaleDateString()} - {dateRange.endDate?.toLocaleDateString()}</p>
            </div>
          </div>

          <div className="card">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Wallet Address
            </h4>
            <p className="text-xs font-mono text-neutral-text-light dark:text-neutral-text-dark break-all">
              {walletAddress}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default TransactionSummary 