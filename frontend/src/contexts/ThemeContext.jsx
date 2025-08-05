import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true) // Always start with dark theme

  useEffect(() => {
    const root = window.document.documentElement
    // Always use dark theme
    root.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  }, [])

  const toggleTheme = () => {
    // Keep it always dark, no toggle needed
    setIsDark(true)
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
} 