import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Calendar, CalendarDays } from 'lucide-react'
import { toast } from 'react-hot-toast'

const DateRangePicker = ({ dateRange, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleStartDateChange = (date) => {
    if (dateRange.endDate && date > dateRange.endDate) {
      toast.error('Start date cannot be after end date')
      return
    }
    onChange(date, dateRange.endDate)
  }

  const handleEndDateChange = (date) => {
    if (dateRange.startDate && date < dateRange.startDate) {
      toast.error('End date cannot be before start date')
      return
    }
    onChange(dateRange.startDate, date)
  }

  const formatDate = (date) => {
    if (!date) return ''
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDateRangeText = () => {
    if (!dateRange.startDate && !dateRange.endDate) {
      return 'Select date range'
    }
    if (dateRange.startDate && !dateRange.endDate) {
      return `From ${formatDate(dateRange.startDate)}`
    }
    if (!dateRange.startDate && dateRange.endDate) {
      return `Until ${formatDate(dateRange.endDate)}`
    }
    return `${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`
  }

  const getDaysDifference = () => {
    if (!dateRange.startDate || !dateRange.endDate) return null
    const diffTime = Math.abs(dateRange.endDate - dateRange.startDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-6">
             {/* Date Range Display */}
       <div className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow">
         <div className="flex items-center space-x-3">
           <CalendarDays className="w-5 h-5 text-blue-400" />
           <div>
             <p className="text-base font-semibold text-white">
               {getDateRangeText()}
             </p>
             {getDaysDifference() && (
               <p className="text-xs text-gray-400">
                 {getDaysDifference()} day{getDaysDifference() !== 1 ? 's' : ''}
               </p>
             )}
           </div>
         </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Change Dates
        </button>
      </div>

             {/* Date Picker Modal */}
       {isOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-all">
           <div className="bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 border border-gray-700">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-bold text-white">
                 Select Date Range
               </h3>
               <button
                 onClick={() => setIsOpen(false)}
                 className="text-gray-400 hover:text-gray-200 text-xl font-bold"
                 aria-label="Close"
               >
                 ×
               </button>
             </div>
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">
                   Start Date
                 </label>
                 <div className="relative">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                     <Calendar className="w-4 h-4" />
                   </span>
                   <DatePicker
                     selected={dateRange.startDate}
                     onChange={handleStartDateChange}
                     selectsStart
                     startDate={dateRange.startDate}
                     endDate={dateRange.endDate}
                     maxDate={new Date()}
                     placeholderText="Select start date"
                     className="input-field pl-10 w-full py-2 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                     dateFormat="MMM dd, yyyy"
                   />
                 </div>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">
                   End Date
                 </label>
                 <div className="relative">
                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                     <Calendar className="w-4 h-4" />
                   </span>
                   <DatePicker
                     selected={dateRange.endDate}
                     onChange={handleEndDateChange}
                     selectsEnd
                     startDate={dateRange.startDate}
                     endDate={dateRange.endDate}
                     minDate={dateRange.startDate}
                     maxDate={new Date()}
                     placeholderText="Select end date"
                     className="input-field pl-10 w-full py-2 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
                     dateFormat="MMM dd, yyyy"
                   />
                 </div>
               </div>
             </div>
             <div className="flex space-x-3 mt-6">
               <button
                 onClick={() => setIsOpen(false)}
                 className="flex-1 py-2 rounded-lg border border-gray-600 bg-gray-800 text-gray-200 hover:bg-gray-700 transition-all"
               >
                 Cancel
               </button>
               <button
                 onClick={() => {
                   if (!dateRange.startDate || !dateRange.endDate) {
                     toast.error('Please select both start and end dates.')
                     return
                   }
                   setIsOpen(false)
                 }}
                 className={`flex-1 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all ${(!dateRange.startDate || !dateRange.endDate) ? 'opacity-50 cursor-not-allowed' : ''}`}
                 disabled={!dateRange.startDate || !dateRange.endDate}
               >
                 Apply
               </button>
             </div>
           </div>
         </div>
       )}

      {/* Quick Date Presets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Last 7 days', days: 7 },
          { label: 'Last 30 days', days: 30 },
          { label: 'Last 90 days', days: 90 },
          { label: 'Last year', days: 365 }
        ].map((preset) => {
          // Highlight if current range matches preset
          let isActive = false
          if (dateRange.startDate && dateRange.endDate) {
            const now = new Date()
            const presetStart = new Date()
            presetStart.setDate(now.getDate() - preset.days)
            isActive =
              dateRange.startDate.toDateString() === presetStart.toDateString() &&
              dateRange.endDate.toDateString() === now.toDateString()
          }
          return (
            <button
              key={preset.days}
              onClick={() => {
                const endDate = new Date()
                const startDate = new Date()
                startDate.setDate(startDate.getDate() - preset.days)
                onChange(startDate, endDate)
              }}
                             className={`p-3 text-sm rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400
                 ${isActive ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-gray-800/50 text-gray-200 border-gray-600 hover:bg-gray-700'}`}
            >
              {preset.label}
            </button>
          )
        })}
      </div>

             {/* Help Text */}
       <div className="text-center text-sm text-gray-400">
         <p>
           Select the date range for your transaction history. 
           We'll fetch all transactions within this period.
         </p>
       </div>
    </div>
  )
}

export default DateRangePicker 