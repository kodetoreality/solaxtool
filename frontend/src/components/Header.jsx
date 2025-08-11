import React from 'react'
import logo from '../assets/logo.png'

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-black/80 via-gray-900/80 to-black/80 backdrop-blur-xl border-b border-white/20 shadow-2xl">
      <div className="container mx-auto">
        <div className="flex items-center justify-center">
          {/* Logo */}
          <div className="relative group">
              <img 
                src={logo} 
                alt="Solana Tax Tool Logo" 
              className="w-23 h-16 object-contain"
              />
            {/* <div className="w-20 h-16 hover:scale-105 transition-all duration-300 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg">
            </div> */}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 