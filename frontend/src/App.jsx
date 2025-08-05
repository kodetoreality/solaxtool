import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { useTheme } from './contexts/ThemeContext'
import Header from './components/Header'
import WalletConnect from './components/WalletConnect'
import DateRangePicker from './components/DateRangePicker'
import TransactionSummary from './components/TransactionSummary'
import ExportButtons from './components/ExportButtons'
import { Sun, Moon } from 'lucide-react'
import image from './assets/image.jpg'

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
        
        {/* Decorative Ring Logo */}
        <div className="absolute top-1/2 right-1/4 transform -translate-y-1/2 opacity-20 pointer-events-none">
          <img 
            src={image} 
            alt="Decorative Ring" 
            className="w-80 h-80 object-contain animate-spin"
            style={{ animationDuration: '20s' }}
          />
        </div>
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
      
      <main className="relative z-10 container mx-auto px-6 py-12 max-w-5xl">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center space-x-3 mb-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-white/10 rounded-full px-6 py-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300 font-medium">Tax Season Ready</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent" style={{ animationDelay: '0.2s' }}>
            Simplify Your Crypto Taxes
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.4s' }}>
            Connect your Solana wallet, select your date range, and export your transaction history 
            for seamless tax reporting.
          </p>
        </div>

        <div className="space-y-6">
          {/* Step 1: Wallet Connection */}
          <div className="group bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-xl border border-white/10 rounded-3xl p-8 animate-fade-in-up hover:bg-gradient-to-br hover:from-white/8 hover:to-white/5 hover:border-white/20 transition-all duration-500 shadow-xl hover:shadow-2xl" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <h2 className="text-2xl font-bold text-white">
                Connect Your Wallet
              </h2>
            </div>
            <WalletConnect onConnect={handleWalletConnect} />
          </div>

          {/* Step 2: Date Range Selection */}
          {walletAddress && (
            <div className="group bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-xl border border-white/10 rounded-3xl p-8 animate-fade-in-up hover:bg-gradient-to-br hover:from-white/8 hover:to-white/5 hover:border-white/20 transition-all duration-500 shadow-xl hover:shadow-2xl" style={{ animationDelay: '0.8s' }}>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Select Date Range
                </h2>
              </div>
              <DateRangePicker 
                dateRange={dateRange}
                onChange={handleDateRangeChange}
              />
            </div>
          )}

          {/* Step 3: Transaction Summary */}
          {walletAddress && dateRange.startDate && dateRange.endDate && (
            <div className="group bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-xl border border-white/10 rounded-3xl p-8 animate-fade-in-up hover:bg-gradient-to-br hover:from-white/8 hover:to-white/5 hover:border-white/20 transition-all duration-500 shadow-xl hover:shadow-2xl" style={{ animationDelay: '1s' }}>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Transaction Summary
                </h2>
              </div>
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
            <div className="group bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-xl border border-white/10 rounded-3xl p-8 animate-fade-in-up hover:bg-gradient-to-br hover:from-white/8 hover:to-white/5 hover:border-white/20 transition-all duration-500 shadow-xl hover:shadow-2xl" style={{ animationDelay: '1.2s' }}>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">4</span>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Export Report
                </h2>
              </div>
              <ExportButtons onExport={handleExport} />
            </div>
          )}
        </div>
      </main>

    </div>
  )
}

export default App 