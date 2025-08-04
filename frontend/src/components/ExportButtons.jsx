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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">
          Export Your Transaction Report
        </h3>
        <p className="text-white max-w-2xl mx-auto">
          Choose your preferred format to download your transaction history for tax reporting and record keeping.
        </p>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {exportOptions.map((option) => {
          const IconComponent = option.icon
          return (
            <div
              key={option.type}
              className={`${option.bgColor} ${option.borderColor} border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 ${option.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className={`w-6 h-6 ${option.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {option.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {option.description}
                  </p>
                  
                  {/* Features list */}
                  <div className="space-y-2 mb-6">
                    {option.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleExport(option.type)}
                    disabled={isExporting}
                    className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isExporting && exportType === option.type
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : `${option.buttonColor} text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95`
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
              </div>
            </div>
          )
        })}
      </div>

      {/* Export Features */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800/40 rounded-lg flex items-center justify-center">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            What's included in your export?
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exportFeatures.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-800/40 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h5 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              Important Notice
            </h5>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 leading-relaxed">
              This report is for informational purposes only and should not be considered as official tax advice. 
              Please consult with a qualified tax professional for your specific tax situation. 
              The data provided is based on blockchain transactions and may require additional verification.
            </p>
          </div>
        </div>
      </div>

      {/* Export Tips */}
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h5 className="font-semibold text-gray-900 dark:text-white mb-3">
          💡 Export Tips
        </h5>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <p>• Save your exports in a secure location for tax filing</p>
          <p>• Keep multiple copies of your transaction reports</p>
          <p>• Review the data for accuracy before filing taxes</p>
          <p>• Consider exporting both CSV and PDF formats for different uses</p>
        </div>
      </div>
    </div>
  )
}

export default ExportButtons 