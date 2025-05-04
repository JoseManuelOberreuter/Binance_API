# Crypto Tracker

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-blue)](https://josemanueloberreuter.github.io/Binance_API)
[![React](https://img.shields.io/badge/React-18.2.0-61dafb)](https://reactjs.org/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.3.3-ff6384)](https://www.chartjs.org/)
[![Binance API](https://img.shields.io/badge/Binance-API-f0b90b)](https://binance-docs.github.io/apidocs/)

A modern cryptocurrency tracking application built with React.js that provides real-time data and historical price charts for various cryptocurrencies using the Binance API.

## Features

- **Real-time cryptocurrency data** from Binance API
- **Interactive price charts** with customizable time periods
- **Top 10 cryptocurrencies** table with key metrics
- **Responsive design** for desktop and mobile devices
- **Currency selection** to view different crypto assets

## Technologies

- **Frontend**: React.js
- **Charts**: Chart.js with react-chartjs-2
- **API Calls**: Axios
- **Styling**: Bootstrap
- **Deployment**: GitHub Pages

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/Binance_API.git
   cd Binance_API
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- Use the time period selector to view different timeframes (week, month, year, all time)
- Browse the table to see the top 10 cryptocurrencies
- Click on any cryptocurrency in the table to view its detailed price chart
- Monitor real-time price updates provided by the Binance API

## Project Structure

### Key Components

1. **SelectTime Component**
   - Dropdown menu for selecting time periods (week, month, year, all time)
   - Triggers chart updates with appropriate interval and limit parameters

2. **ChartComponent**
   - Core visualization using Chart.js
   - Displays historical price data as an interactive line chart
   - Fetches and processes historical price data from Binance API

3. **Table Component**
   - Displays information about top cryptocurrencies
   - Shows names, prices, volumes, and 24-hour price ranges

4. **ApiTable Component**
   - Interfaces with Binance API for real-time cryptocurrency data
   - Updates table with live price information
   - Provides buttons to select different cryptocurrencies for the chart view

## Deployment

The app is deployed using GitHub Pages. To deploy your own version:

```bash
npm run deploy
```

## Live Demo

Visit the live application: [Crypto Tracker App](https://josemanueloberreuter.github.io/Binance_API)


