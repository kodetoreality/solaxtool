import React, { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { useTheme } from './contexts/ThemeContext'
import Header from './components/Header'
import WalletConnect from './components/WalletConnect'
import DateRangePicker from './components/DateRangePicker'
import TransactionSummary from './components/TransactionSummary'
import ExportButtons from './components/ExportButtons'
import { Sun, Moon } from 'lucide-react'
import logoGif from './assets/image.gif'
import { getComprehensiveData, exportCSV, exportPDF } from './services/api'

function App() {
  const { isDark, toggleTheme } = useTheme()
  const [walletAddress, setWalletAddress] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null })
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [summary, setSummary] = useState(null)

  // Fetch transactions when wallet address and date range change
  useEffect(() => {
    if (walletAddress && dateRange.startDate && dateRange.endDate) {
      fetchTransactions()
    }
  }, [walletAddress, dateRange])

  const fetchTransactions = async () => {
    if (!walletAddress || !dateRange.startDate || !dateRange.endDate) return

    setIsLoading(true)
    try {
      const response = await getComprehensiveData(
        walletAddress,
        dateRange.startDate,
        dateRange.endDate
      )

      if (response.success) {
        setTransactions(response.data.transactions || [])
        setSummary(response.data.summary || null)
      } else {
        throw new Error(response.message || 'Failed to fetch transactions')
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
      toast.error(error.message || 'Failed to fetch transactions')
      setTransactions([])
      setSummary(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWalletConnect = (address) => {
    setWalletAddress(address)
    setTransactions([])
    setSummary(null)
  }

  const handleDateRangeChange = (start, end) => {
    setDateRange({ startDate: start, endDate: end })
  }

  const handleExport = async (format) => {
    if (!walletAddress || !dateRange.startDate || !dateRange.endDate) {
      toast.error('Please select a wallet and date range first')
      return
    }

    try {
      toast.loading(`Exporting ${format.toUpperCase()}...`)
      
      if (format === 'csv') {
        await exportCSV(walletAddress, dateRange.startDate, dateRange.endDate)
      } else if (format === 'pdf') {
        await exportPDF(walletAddress, dateRange.startDate, dateRange.endDate)
      }
      
      toast.dismiss()
      toast.success(`${format.toUpperCase()} export completed!`)
    } catch (error) {
      console.error(`Error exporting ${format}:`, error)
      toast.dismiss()
      toast.error(`Failed to export ${format.toUpperCase()}: ${error.message}`)
    }
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
      
      <main className="relative z-10 container mx-auto px-4 py-12 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-green-400 text-sm font-semibold">Tax Season Ready</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Simplify Your Crypto Taxes
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Connect your Solana wallet, select a date range, and get a comprehensive transaction report for tax purposes.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {/* Step 1: Wallet Connect */}
          <div className="group bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-xl border border-white/10 rounded-3xl p-8 animate-fade-in-up hover:bg-gradient-to-br hover:from-white/8 hover:to-white/5 hover:border-white/20 transition-all duration-500 shadow-xl hover:shadow-2xl">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <h2 className="text-2xl font-bold text-white">
                Connect Wallet
              </h2>
            </div>
            <WalletConnect onConnect={handleWalletConnect} />
          </div>

          {/* Step 2: Date Range */}
          {walletAddress && (
            <div className="group bg-gradient-to-br from-white/5 to-white/3 backdrop-blur-xl border border-white/10 rounded-3xl p-8 animate-fade-in-up hover:bg-gradient-to-br hover:from-white/8 hover:to-white/5 hover:border-white/20 transition-all duration-500 shadow-xl hover:shadow-2xl" style={{ animationDelay: '0.3s' }}>
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
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold text-white">
                    Transaction Summary
                  </h2>
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full px-3 py-1">
                    <span className="text-green-400 text-sm font-semibold">Free</span>
                  </div>
                </div>
              </div>
              <TransactionSummary 
                transactions={transactions}
                isLoading={isLoading}
                walletAddress={walletAddress}
                dateRange={dateRange}
                summary={summary}
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
      <footer className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center space-y-4">
            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <a
                href="https://x.com/solaxtool"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200 p-2 hover:bg-white/10 rounded-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://github.com/solaxtool"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200 p-2 hover:bg-white/10 rounded-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>

            {/* Decorative GIF Logo */}
            <div className="flex justify-center relative -top-16 z-0">
              <div className="relative w-48 h-48 rounded-full bg-black overflow-hidden">
                <img 
                  src={logoGif} 
                  alt="Decorative Logo" 
                  className="w-full h-full object-contain"
                  style={{
                    imageRendering: 'auto',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)'
                  }}
                  onLoad={(e) => {
                    // Force the GIF to restart if it has timing issues
                    e.target.style.animation = 'none';
                    e.target.offsetHeight; // Trigger reflow
                    e.target.style.animation = null;
                  }}
                />
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6 text-[11px] text-gray-500">
              <a href="/privacy" className="hover:text-gray-400 transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-gray-400 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App 