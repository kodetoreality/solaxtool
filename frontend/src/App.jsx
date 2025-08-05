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
      {/* <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        
        <div className="absolute top-1/4 right-1/5 transform -translate-y-1/2 opacity-25 pointer-events-none z-0">
          <img 
            src={image} 
            alt="Decorative Ring" 
            className="w-96 h-96 object-contain animate-spin"
            style={{ animationDuration: '30s' }}
          />
        </div>
      </div> */}

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
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold text-white">
                    Export Report
                  </h2>
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full px-3 py-1">
                    <span className="text-yellow-400 text-sm font-semibold">0.1 SOL</span>
                    <span className="text-gray-400 text-xs">per export</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Transaction summary is free to view. Export to PDF or CSV for tax reporting costs 0.1 SOL per file.
              </p>
              <ExportButtons onExport={handleExport} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full flex flex-col items-center justify-center mt-12 mb-4 space-y-2">
        <div className="flex space-x-4 text-[11px] text-gray-500">
          <a href="/privacy" className="hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          <span className="opacity-50">|</span>
          <a href="/terms" className="hover:underline" target="_blank" rel="noopener noreferrer">Terms of Service</a>
        </div>
        <div className="flex space-x-3 mt-1">
          <a href="https://x.com/solaxtool" target="_blank" rel="noopener noreferrer" aria-label="X">
            <svg width="16" height="16" fill="currentColor" className="text-gray-500 hover:text-white transition-colors" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="https://github.com/solaxtool" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <svg width="16" height="16" fill="currentColor" className="text-gray-500 hover:text-white transition-colors" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.304-5.466-1.334-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.984-.399 3.003-.404 1.018.005 2.046.138 3.006.404 2.289-1.553 3.295-1.23 3.295-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.625-5.475 5.921.43.371.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .321.218.694.825.576C20.565 21.796 24 17.299 24 12c0-6.627-5.373-12-12-12z"/></svg>
          </a>
        </div>
        
        {/* Decorative Image */}
        <div className="mt-6 flex justify-center">
          <img 
            src={image} 
            alt="Decorative Image" 
            className="w-32 h-32 object-contain opacity-30"
          />
        </div>
      </footer>

    </div>
  )
}

export default App 