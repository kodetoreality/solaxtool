import React, { useState, useRef, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { toast } from 'react-hot-toast'
import { Wallet, Copy, Check, ExternalLink, LogOut } from 'lucide-react'

const WalletConnect = ({ onConnect }) => {
  const { publicKey, connected, connecting, disconnect, connect, wallet, wallets, select } = useWallet()
  const [manualAddress, setManualAddress] = useState('')
  const [copied, setCopied] = useState(false)
  const [shouldConnect, setShouldConnect] = useState(false)
  const [isActuallyConnected, setIsActuallyConnected] = useState(false)
  const lastConnectedAddress = useRef(null)

  // Check if wallet is actually connected on component mount
  useEffect(() => {
    if (connected && publicKey) {
      // If wallet adapter says connected and we have a public key, consider it connected
      setIsActuallyConnected(true)
      if (lastConnectedAddress.current !== publicKey.toString()) {
        onConnect(publicKey.toString())
        lastConnectedAddress.current = publicKey.toString()
      }
    } else {
      setIsActuallyConnected(false)
      lastConnectedAddress.current = null
    }
  }, [connected, publicKey, onConnect])

  const handleManualAddressSubmit = (e) => {
    e.preventDefault()
    if (!manualAddress.trim()) {
      toast.error('Please enter a wallet address')
      return
    }
    
    // Basic Solana address validation
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(manualAddress.trim())) {
      toast.error('Please enter a valid Solana wallet address')
      return
    }
    
    try {
      onConnect(manualAddress.trim())
      setIsActuallyConnected(true)
      toast.success('Wallet address connected successfully!')
    } catch (error) {
      console.error('Manual address connection error:', error)
      toast.error('Failed to connect wallet address. Please try again.')
    }
  }

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString())
      setCopied(true)
      toast.success('Address copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const viewOnExplorer = () => {
    if (publicKey) {
      window.open(`https://solscan.io/account/${publicKey.toString()}`, '_blank')
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
      setIsActuallyConnected(false)
      lastConnectedAddress.current = null
      toast.success('Wallet disconnected successfully!')
    } catch (error) {
      toast.error('Failed to disconnect wallet.')
    }
  }

  const handleConnect = async () => {
    const phantom = wallets.find(w => w.adapter.name === 'Phantom')
    if (phantom) {
      try {
        await select(phantom.adapter.name)
        await connect()
        setIsActuallyConnected(true)
        toast.success('Wallet connected successfully!')
      } catch (err) {
        toast.error('Failed to connect to Phantom wallet.')
      }
    } else {
      toast.error('Phantom wallet not found.')
    }
  }

  // Check if we need to show the connect button
  const shouldShowConnectButton = !isActuallyConnected || !connected

  return (
    <div className="space-y-6">
      {/* Phantom Connect Button */}
      {shouldShowConnectButton && (
        <div className="flex justify-center">
          <button
            type="button"
            className="bg-white text-black font-medium px-8 py-3 rounded-lg hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all duration-300 transform"
            onClick={handleConnect}
            disabled={connecting}
          >
            <Wallet className="w-5 h-5 inline mr-2 animate-pulse" />
            {connecting ? 'Connecting...' : 'Connect with Phantom'}
          </button>
        </div>
      )}

      {/* Connected Status */}
      {isActuallyConnected && connected && publicKey && (
        <div className="flex justify-center">
          <div className="bg-green-500/20 border border-green-500/30 text-green-300 font-medium px-6 py-2 rounded-lg">
            <Check className="w-4 h-4 inline mr-2" />
            Wallet Connected
          </div>
        </div>
      )}

      {/* Disconnect Button */}
      {isActuallyConnected && connected && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleDisconnect}
            className="bg-red-500/20 border border-red-500/30 text-red-300 font-medium px-6 py-2 rounded-lg hover:bg-red-500/30 hover:scale-105 active:scale-95 transition-all duration-300 transform"
          >
            <LogOut className="w-4 h-4 inline mr-2" />
            Disconnect Wallet
          </button>
        </div>
      )}

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-black text-white/60">
            or enter address manually
          </span>
        </div>
      </div>

      {/* Manual Address Input */}
      <form onSubmit={handleManualAddressSubmit} className="space-y-4 animate-fade-in-up">
        <div>
          <label htmlFor="wallet-address" className="block text-sm font-medium text-white mb-2">
            Solana Wallet Address
          </label>
          <input
            id="wallet-address"
            type="text"
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            placeholder="Enter your Solana wallet address..."
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white focus:border-white transition-all duration-300 hover:bg-white/10"
          />
        </div>
        <button type="submit" className="w-full bg-white/10 border border-white/20 text-white font-medium px-6 py-3 rounded-lg hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-300 transform">
          Connect Address
        </button>
      </form>

      {/* Connected Wallet Info */}
      {isActuallyConnected && connected && publicKey && (
        <div className="bg-white/5 border border-white/20 rounded-lg p-4 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Wallet Connected
                </p>
                <p className="text-xs text-white/60 font-mono">
                  {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={copyAddress}
                className="p-2 text-white/60 hover:text-white hover:scale-110 transition-all duration-200"
                title="Copy address"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={viewOnExplorer}
                className="p-2 text-white/60 hover:text-white hover:scale-110 transition-all duration-200"
                title="View on explorer"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-center text-sm text-white/60 animate-fade-in-up">
        <p>Connect your Phantom wallet or paste your Solana address to get started.</p>
      </div>
    </div>
  )
}

export default WalletConnect 