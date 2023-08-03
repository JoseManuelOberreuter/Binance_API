import React, { useEffect } from 'react';


const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT', 'MATICUSDT', 'DOGEUSDT', 'SOLUSDT', 'LTCUSDT', 'DOTUSDT'];
const names = ['Bitcoin', 'Ethereum', 'Binance Coin', 'Ripple', 'Cardano', 'Polygon', 'Dogecoin', 'Solana', 'Litecoin', 'Polkadot'];
const links = ['index', 'ethereum', 'binance_coin', 'ripple', 'cardano', 'polygon', 'dogecoin', 'solana', 'litecoin', 'polkadot'];

const ApiTable = () => {
  useEffect(() => {
    const binanceApi = async () => {
      try {
        for (let i = 0; i < symbols.length; i++) {
          const symbol = symbols[i];
          const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
          const data = await response.json();

          const nameElement = document.querySelector(`.cripto_name${i + 1}`);
          nameElement.textContent = names[i];

          const buttonElement = document.createElement('button');
          buttonElement.className = 'crypto-button';
          buttonElement.textContent = names[i];
          buttonElement.onclick = cryptoButtonClickHandlers[i]; // Assign the corresponding function to each button

          nameElement.innerHTML = '';
          nameElement.appendChild(buttonElement);

          document.querySelector(`.cripto_price${i + 1}`).textContent = parseFloat(data.lastPrice).toFixed(2);
          document.querySelector(`.cripto_vol${i + 1}`).textContent = parseFloat(data.volume).toFixed(2);
          document.querySelector(`.cripto_high${i + 1}`).textContent = parseFloat(data.highPrice).toFixed(2);
          document.querySelector(`.cripto_low${i + 1}`).textContent = parseFloat(data.lowPrice).toFixed(2);
        }
      } catch (error) {
        console.error(error);
      }
    };

    binanceApi();
  }, []);

  // Functions for handling the click event for each cryptocurrency
  const handleBitcoinClick = () => {
    // Implement the logic for Bitcoin
    console.log('Selected cryptocurrency: Bitcoin');
  };

  const handleEthereumClick = () => {
    // Implement the logic for Ethereum
    console.log('Selected cryptocurrency: Ethereum');
  };

  const handleBinanceCoinClick = () => {
    // Implement the logic for Binance Coin
    console.log('Selected cryptocurrency: Binance Coin');
  };

  const handleRippleClick = () => {
    // Implement the logic for Ripple
    console.log('Selected cryptocurrency: Ripple');
  };

  const handleCardanoClick = () => {
    // Implement the logic for Cardano
    console.log('Selected cryptocurrency: Cardano');
  };

  const handlePolygonClick = () => {
    // Implement the logic for Polygon
    console.log('Selected cryptocurrency: Polygon');
  };

  const handleDogecoinClick = () => {
    // Implement the logic for Dogecoin
    console.log('Selected cryptocurrency: Dogecoin');
  };

  const handleSolanaClick = () => {
    // Implement the logic for Solana
    console.log('Selected cryptocurrency: Solana');
  };

  const handleLitecoinClick = () => {
    // Implement the logic for Litecoin
    console.log('Selected cryptocurrency: Litecoin');
  };

  const handlePolkadotClick = () => {
    // Implement the logic for Polkadot
    console.log('Selected cryptocurrency: Polkadot');
  };

  // Function mapping to each cryptocurrency
  const cryptoButtonClickHandlers = [
    handleBitcoinClick,
    handleEthereumClick,
    handleBinanceCoinClick,
    handleRippleClick,
    handleCardanoClick,
    handlePolygonClick,
    handleDogecoinClick,
    handleSolanaClick,
    handleLitecoinClick,
    handlePolkadotClick,
  ];

  return (
    <div>
      {/* Render placeholders for the cryptocurrency data */}
      {symbols.map((symbol, i) => (
        <div key={i}>
          <p className={`cripto_name${i + 1}`} />
          <p className={`cripto_price${i + 1}`} />
          <p className={`cripto_vol${i + 1}`} />
          <p className={`cripto_high${i + 1}`} />
          <p className={`cripto_low${i + 1}`} />
        </div>
      ))}
    </div>
  );
};

export default ApiTable;
