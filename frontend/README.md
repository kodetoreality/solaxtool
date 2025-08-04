# Solana Tax Tool - Frontend

A professional, modern frontend for the Solana Tax Reporting Tool. Built with React, Vite, TailwindCSS, and Solana Wallet Adapter.

## Features

- 🔗 **Wallet Connection**: Connect via Phantom wallet or enter address manually
- 📅 **Date Range Selection**: Choose custom date ranges or use presets
- 📊 **Transaction Summary**: View categorized transactions with detailed analytics
- 📄 **Export Options**: Download reports as CSV or PDF
- 🌙 **Dark/Light Mode**: Toggle between themes
- 📱 **Responsive Design**: Works perfectly on desktop and mobile
- ⚡ **Fast & Modern**: Built with Vite for lightning-fast development

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Solana Wallet Adapter** - Official Solana wallet integration
- **React DatePicker** - Date range selection
- **React Hot Toast** - Beautiful notifications
- **Lucide React** - Modern icon library

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Header.jsx      # Navigation header
│   │   ├── WalletConnect.jsx # Wallet connection
│   │   ├── DateRangePicker.jsx # Date selection
│   │   ├── TransactionSummary.jsx # Transaction display
│   │   └── ExportButtons.jsx # Export functionality
│   ├── contexts/           # React contexts
│   │   └── ThemeContext.jsx # Dark/light mode
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # TailwindCSS configuration
└── README.md              # This file
```

## Design System

### Colors
- **Primary**: Purple (#5D50F9) to Blue (#00C2FF) gradient
- **Background**: Light (#FAFAFA) / Dark (#0E1116)
- **Success**: Green (#3ECF8E)
- **Error**: Red (#FF4C4C)

### Typography
- **Font**: Inter (clean, modern sans-serif)
- **Weights**: 300, 400, 500, 600, 700

### Components
- **Cards**: Rounded corners, subtle shadows, hover effects
- **Buttons**: Gradient backgrounds, smooth transitions
- **Tags**: Color-coded transaction types
- **Tables**: Responsive, hover effects

## Features in Detail

### Wallet Connection
- Phantom wallet integration via Solana Wallet Adapter
- Manual address input with validation
- Copy address and view on explorer functionality
- Connection status indicators

### Date Range Picker
- Modal-based date selection
- Quick preset buttons (7 days, 30 days, 90 days, 1 year)
- Date validation and error handling
- Visual date range display

### Transaction Summary
- Categorized transaction types (Buy, Sell, Swap, LP, Airdrop)
- Summary cards with key metrics
- Detailed transaction table
- Net gain/loss calculations
- Transaction hash links to Solscan

### Export Functionality
- CSV export for tax software compatibility
- PDF export for professional reports
- Loading states and success animations
- Feature list and disclaimers

## Development

### Adding New Components

1. Create a new file in `src/components/`
2. Import required dependencies
3. Use the established design patterns
4. Add proper TypeScript types if needed

### Styling Guidelines

- Use TailwindCSS utility classes
- Follow the established color palette
- Implement dark mode support
- Add hover and focus states
- Use smooth transitions

### State Management

- Use React hooks for local state
- Context API for theme management
- Props for component communication
- Consider Redux for complex state (future)

## Backend Integration

This frontend is designed to work with a Node.js backend that provides:

- Solana RPC connection
- Transaction history fetching
- Price data from CoinGecko
- CSV/PDF generation
- Transaction categorization

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Lazy loading for components
- Optimized bundle size
- Efficient re-renders
- Image optimization

## Security

- Input validation
- XSS protection
- Secure wallet integration
- No sensitive data storage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository. 