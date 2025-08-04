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
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center space-x-3">
          <CalendarDays className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <div>
            <p className="text-sm font-medium text-neutral-text-light dark:text-neutral-text-dark">
              {getDateRangeText()}
            </p>
            {getDaysDifference() && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {getDaysDifference()} day{getDaysDifference() !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn-secondary"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Change Dates
        </button>
      </div>

      {/* Date Picker Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-text-light dark:text-neutral-text-dark">
                Select Date Range
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-text-light dark:text-neutral-text-dark mb-2">
                  Start Date
                </label>
                <DatePicker
                  selected={dateRange.startDate}
                  onChange={handleStartDateChange}
                  selectsStart
                  startDate={dateRange.startDate}
                  endDate={dateRange.endDate}
                  maxDate={new Date()}
                  placeholderText="Select start date"
                  className="input-field"
                  dateFormat="MMM dd, yyyy"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-text-light dark:text-neutral-text-dark mb-2">
                  End Date
                </label>
                <DatePicker
                  selected={dateRange.endDate}
                  onChange={handleEndDateChange}
                  selectsEnd
                  startDate={dateRange.startDate}
                  endDate={dateRange.endDate}
                  minDate={dateRange.startDate}
                  maxDate={new Date()}
                  placeholderText="Select end date"
                  className="input-field"
                  dateFormat="MMM dd, yyyy"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-primary flex-1"
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
        ].map((preset) => (
          <button
            key={preset.days}
            onClick={() => {
              const endDate = new Date()
              const startDate = new Date()
              startDate.setDate(startDate.getDate() - preset.days)
              onChange(startDate, endDate)
            }}
            className="p-3 text-sm border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-neutral-text-light dark:text-neutral-text-dark"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Help Text */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Select the date range for your transaction history. 
          We'll fetch all transactions within this period.
        </p>
      </div>
    </div>
  )
}

export default DateRangePicker 