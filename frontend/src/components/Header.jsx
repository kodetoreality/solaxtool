import React from 'react'
import { Wallet } from 'lucide-react'

const Header = () => {
  return (
    <header className="bg-white/5 backdrop-blur-sm border-b border-white/10 animate-fade-in-up">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-white hover:text-white/80 transition-colors duration-300">
              Solana Tax Tool
            </h1>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 