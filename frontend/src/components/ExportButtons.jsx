import React, { useState } from 'react'
import { FileText, Download, FileSpreadsheet, File, Check, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

const ExportButtons = ({ onExport }) => {
  const [isExporting, setIsExporting] = useState(false)
  const [exportType, setExportType] = useState(null)

  const handleExport = async (type) => {
    setIsExporting(true)
    setExportType(type)
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      onExport(type)
      
      toast.success(`${type.toUpperCase()} export completed successfully!`, {
        icon: '📄',
        duration: 4000,
      })
      
      // Trigger confetti effect for successful export
      if (typeof window !== 'undefined' && window.confetti) {
        window.confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
      }
    } catch (error) {
      toast.error(`Failed to export ${type.toUpperCase()}. Please try again.`)
    } finally {
      setIsExporting(false)
      setExportType(null)
    }
  }

  const getExportIcon = (type) => {
    switch (type) {
      case 'csv':
        return <FileSpreadsheet className="w-5 h-5" />
      case 'pdf':
        return <File className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const getExportDescription = (type) => {
    switch (type) {
      case 'csv':
        return 'Spreadsheet format for tax software'
      case 'pdf':
        return 'Professional report for filing'
      default:
        return 'Export your transaction data'
    }
  }

  return (
    <div className="space-y-6">
      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CSV Export */}
        <div className="card hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-primary-purple/20">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-neutral-text-light dark:text-neutral-text-dark mb-1">
                Export as CSV
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Perfect for importing into tax software like TurboTax, H&R Block, or your accountant's spreadsheet.
              </p>
              <button
                onClick={() => handleExport('csv')}
                disabled={isExporting}
                className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isExporting && exportType === 'csv'
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {isExporting && exportType === 'csv' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Download CSV</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* PDF Export */}
        <div className="card hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-primary-purple/20">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <File className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-neutral-text-light dark:text-neutral-text-dark mb-1">
                Export as PDF
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Professional report with transaction details, summaries, and tax calculations.
              </p>
              <button
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
                className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isExporting && exportType === 'pdf'
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {isExporting && exportType === 'pdf' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Export Features */}
      <div className="card bg-gradient-to-r from-primary-purple/5 to-primary-blue/5 border-primary-purple/20">
        <h3 className="text-lg font-semibold text-neutral-text-light dark:text-neutral-text-dark mb-4">
          What's included in your export?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-sm text-neutral-text-light dark:text-neutral-text-dark">
                Complete transaction history
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-sm text-neutral-text-light dark:text-neutral-text-dark">
                Categorized transactions (Buy, Sell, Swap, LP, Airdrop)
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-sm text-neutral-text-light dark:text-neutral-text-dark">
                Historical USD prices at transaction time
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-sm text-neutral-text-light dark:text-neutral-text-dark">
                Net gain/loss calculations
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-sm text-neutral-text-light dark:text-neutral-text-dark">
                Transaction hashes for verification
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-500" />
              <span className="text-sm text-neutral-text-light dark:text-neutral-text-dark">
                Tax-friendly formatting
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
          Important Notice
        </p>
        <p>
          This report is for informational purposes only and should not be considered as official tax advice. 
          Please consult with a qualified tax professional for your specific tax situation.
        </p>
      </div>
    </div>
  )
}

export default ExportButtons 