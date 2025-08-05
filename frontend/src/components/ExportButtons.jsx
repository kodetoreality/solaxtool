import React, { useState } from 'react'
import { FileText, Download, FileSpreadsheet, File, Check, Loader2, AlertCircle, Info } from 'lucide-react'
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

  const exportOptions = [
    {
      type: 'csv',
      title: 'Export as CSV',
      description: 'Perfect for importing into tax software like TurboTax, H&R Block, or your accountant\'s spreadsheet.',
      icon: FileSpreadsheet,
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-700',
      iconBg: 'bg-green-100 dark:bg-green-800/40',
      iconColor: 'text-green-600 dark:text-green-400',
      buttonColor: 'bg-green-500 hover:bg-green-600',
      features: ['Compatible with all tax software', 'Easy to import into spreadsheets', 'Standard CSV format']
    },
    {
      type: 'pdf',
      title: 'Export as PDF',
      description: 'Professional report with transaction details, summaries, and tax calculations.',
      icon: File,
      color: 'red',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-700',
      iconBg: 'bg-red-100 dark:bg-red-800/40',
      iconColor: 'text-red-600 dark:text-red-400',
      buttonColor: 'bg-red-500 hover:bg-red-600',
      features: ['Professional formatting', 'Complete transaction details', 'Ready for filing']
    }
  ]

  const exportFeatures = [
    'Complete transaction history',
    'Categorized transactions (Buy, Sell, Swap, LP, Airdrop)',
    'Historical USD prices at transaction time',
    'Net gain/loss calculations',
    'Transaction hashes for verification',
    'Tax-friendly formatting',
    'Date range summary',
    'Wallet address verification'
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {exportOptions.map((option) => {
        const IconComponent = option.icon
        return (
          <div
            key={option.type}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 flex flex-col h-full"
          >
            {/* Icon */}
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                option.type === 'csv' ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                <IconComponent className={`w-5 h-5 ${
                  option.type === 'csv' ? 'text-green-400' : 'text-red-400'
                }`} />
              </div>
              <h4 className="text-xl font-bold text-white">
                {option.title}
              </h4>
            </div>

            {/* Description */}
            <p className="text-gray-300 mb-6 leading-relaxed">
              {option.description}
            </p>
            
            {/* Features list */}
            <div className="space-y-3 mb-8 flex-grow">
              {option.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            {/* Download Button */}
            <button
              onClick={() => handleExport(option.type)}
              disabled={isExporting}
              className={`w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-semibold transition-all duration-200 mt-auto ${
                isExporting && exportType === option.type
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : option.type === 'csv'
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
              aria-label={`Export as ${option.type.toUpperCase()}`}
            >
              {isExporting && exportType === option.type ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Download {option.type.toUpperCase()}</span>
                </>
              )}
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default ExportButtons 