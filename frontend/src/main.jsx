import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import { ThemeProvider } from './contexts/ThemeContext.jsx'

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css'

// Default RPC endpoint
const network = WalletAdapterNetwork.Mainnet
const endpoint = clusterApiUrl(network)

// Initialize wallet adapters
const wallets = [new PhantomWalletAdapter()]

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect={false}>
          <WalletModalProvider>
            <App />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  </React.StrictMode>,
) 