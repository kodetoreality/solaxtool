import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { useTheme } from './contexts/ThemeContext'
import Header from './components/Header'
import WalletConnect from './components/WalletConnect'
import DateRangePicker from './components/DateRangePicker'
import TransactionSummary from './components/TransactionSummary'
import ExportButtons from './components/ExportButtons'
import { Sun, Moon } from 'lucide-react'

function App() {
  const { isDark, toggleTheme } = useTheme()
  const [walletAddress, setWalletAddress] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null })
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleWalletConnect = (address) => {
    setWalletAddress(address)
    // In a real app, you would fetch transactions here
    // For now, we'll simulate with mock data
    setIsLoading(true)
    setTimeout(() => {
      setTransactions([
        {
          id: 1,
          type: 'buy',
          token: 'SOL',
          amount: 10.5,
          price: 95.23,
          date: '2024-01-15',
          txHash: '5J7X...',
          value: 999.92
        },
        {
          id: 2,
          type: 'swap',
          token: 'USDC',
          amount: 500,
          price: 1.00,
          date: '2024-01-20',
          txHash: '3K9M...',
          value: 500.00
        },
        {
          id: 3,
          type: 'sell',
          token: 'SOL',
          amount: 5.2,
          price: 98.45,
          date: '2024-01-25',
          txHash: '7N2P...',
          value: 511.94
        }
      ])
      setIsLoading(false)
    }, 2000)
  }

  const handleDateRangeChange = (start, end) => {
    setDateRange({ startDate: start, endDate: end })
  }

  const handleExport = (format) => {
    // In a real app, this would call the backend API
    console.log(`Exporting ${format} for wallet: ${walletAddress}`)
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
      
      <Header />
      
      <main className="relative z-10 container mx-auto px-6 py-16 max-w-4xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Solana Tax Tool
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Connect your wallet, select a date range, and export your transaction history 
            for tax reporting.
          </p>
        </div>

        <div className="space-y-8">
          {/* Step 1: Wallet Connection */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 animate-fade-in-up hover:bg-white/10 transition-all duration-300" style={{ animationDelay: '0.6s' }}>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Connect Your Wallet
            </h2>
            <WalletConnect onConnect={handleWalletConnect} />
          </div>

          {/* Step 2: Date Range Selection */}
          {walletAddress && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 animate-fade-in-up hover:bg-white/10 transition-all duration-300" style={{ animationDelay: '0.8s' }}>
              <h2 className="text-2xl font-semibold text-white mb-6">
                Select Date Range
              </h2>
              <DateRangePicker 
                dateRange={dateRange}
                onChange={handleDateRangeChange}
              />
            </div>
          )}

          {/* Step 3: Transaction Summary */}
          {walletAddress && dateRange.startDate && dateRange.endDate && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 animate-fade-in-up hover:bg-white/10 transition-all duration-300" style={{ animationDelay: '1s' }}>
              <h2 className="text-2xl font-semibold text-white mb-6">
                Transaction Summary
              </h2>
              <TransactionSummary 
                transactions={transactions}
                isLoading={isLoading}
                walletAddress={walletAddress}
                dateRange={dateRange}
              />
            </div>
          )}

          {/* Step 4: Export */}
          {transactions.length > 0 && !isLoading && dateRange.startDate && dateRange.endDate && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 animate-fade-in-up hover:bg-white/10 transition-all duration-300" style={{ animationDelay: '1.2s' }}>
              <h2 className="text-2xl font-semibold text-white mb-6">
                Export Report
              </h2>
              <ExportButtons onExport={handleExport} />
            </div>
          )}
        </div>
      </main>

    </div>
  )
}

export default App 