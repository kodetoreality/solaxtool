import React, { useState, useEffect } from 'react';
import { X, Copy, CheckCircle, Clock, AlertCircle, Download } from 'lucide-react';
import QRCode from 'qrcode';

const PaymentModal = ({ isOpen, onClose, exportType, walletAddress, dateRange, onPaymentComplete }) => {
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, paid, expired, failed
  const [countdown, setCountdown] = useState(900); // 15 minutes in seconds
  const [qrCodeData, setQrCodeData] = useState('');
  const [copied, setCopied] = useState(false);

  // Create payment request when modal opens
  useEffect(() => {
    if (isOpen && !paymentRequest) {
      createPaymentRequest();
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (paymentRequest && paymentStatus === 'pending' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && paymentStatus === 'pending') {
      setPaymentStatus('expired');
    }
  }, [countdown, paymentStatus, paymentRequest]);

  // Poll payment status
  useEffect(() => {
    if (paymentRequest && paymentStatus === 'pending') {
      const interval = setInterval(checkPaymentStatus, 5000); // Check every 5 seconds
      return () => clearInterval(interval);
    }
  }, [paymentRequest, paymentStatus]);

  const createPaymentRequest = async () => {
    try {
      // Use the API base URL from environment or default to 3001
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      
      const response = await fetch(`${apiBaseUrl}/payments/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exportType,
          walletAddress,
          dateRange: {
            startDate: dateRange.startDate.toISOString().split('T')[0],
            endDate: dateRange.endDate.toISOString().split('T')[0]
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentRequest(data.data.paymentRequest);
        
        // Generate QR code for the payment address
        const qrData = `sol:${data.data.paymentRequest.paymentAddress}?amount=${data.data.paymentRequest.amount}`;
        const qrCode = await QRCode.toDataURL(qrData);
        setQrCodeData(qrCode);
      } else {
        throw new Error('Failed to create payment request');
      }
    } catch (error) {
      console.error('Error creating payment request:', error);
      setPaymentStatus('failed');
    }
  };

  const checkPaymentStatus = async () => {
    if (!paymentRequest) return;

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiBaseUrl}/payments/${paymentRequest.id}/status`);
      if (response.ok) {
        const data = await response.json();
        const newStatus = data.data.paymentRequest.status;
        setPaymentStatus(newStatus);
        
        if (newStatus === 'paid') {
          onPaymentComplete(paymentRequest.id);
        }
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Export {exportType.toUpperCase()} Report
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {paymentStatus === 'pending' && paymentRequest && (
            <>
              {/* Payment Instructions */}
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Send 0.1 SOL to continue
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Complete payment to download your {exportType.toUpperCase()} report
                </p>
              </div>

              {/* Countdown Timer */}
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {formatTime(countdown)}
                </div>
                <p className="text-sm text-red-600 dark:text-red-400">
                  Time remaining to complete payment
                </p>
              </div>

              {/* QR Code */}
              {qrCodeData && (
                <div className="text-center">
                  <img src={qrCodeData} alt="Payment QR Code" className="mx-auto w-48 h-48" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Scan with Solana wallet to pay
                  </p>
                </div>
              )}

              {/* Payment Address */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Payment Address
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={paymentRequest.paymentAddress}
                    readOnly
                    className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm font-mono text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={() => copyToClipboard(paymentRequest.paymentAddress)}
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-lg transition-colors"
                  >
                    {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {paymentRequest.amount} SOL
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Payment amount
                </p>
              </div>

              {/* Status */}
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span>Waiting for payment confirmation...</span>
              </div>
            </>
          )}

          {paymentStatus === 'paid' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Payment Confirmed!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Your {exportType.toUpperCase()} report is ready for download
              </p>
              <button
                onClick={() => onPaymentComplete(paymentRequest.id)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download Report</span>
              </button>
            </div>
          )}

          {paymentStatus === 'expired' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Payment Expired
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                The payment request has expired. Please try again.
              </p>
              <button
                onClick={createPaymentRequest}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Create New Payment Request
              </button>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Something went wrong
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Failed to create payment request. Please try again.
              </p>
              <button
                onClick={createPaymentRequest}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 