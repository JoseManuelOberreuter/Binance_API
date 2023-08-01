import React, { useEffect } from 'react';

const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT', 'MATICUSDT', 'DOGEUSDT', 'SOLUSDT', 'LTCUSDT', 'DOTUSDT'];
const names = ['Bitcoin', 'Ethereum', 'Binance Coin', 'Ripple', 'Cardano', 'Polygon', 'Dogecoin', 'Solana', 'Litecoin', 'Polkadot'];
const links = ['index', 'ethereum', 'binance_coin', 'ripple', 'cardano', 'polygon', 'dogecoin', 'solana', 'litecoin', 'polkadot'];

const CryptoInfo = () => {
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
          buttonElement.onclick = () => handleCryptoClick(names[i]); // Handle click event for each cryptocurrency

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

    const handleCryptoClick = (name) => {
      // Implement the logic to update the canvas based on the selected cryptocurrency name
      console.log('Selected cryptocurrency:', name);
    };

    binanceApi();
  }, []);

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

export default CryptoInfo;



