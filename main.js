const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT', 'BUSDUSDT', 'DOGEUSDT', 'SOLUSDT', 'LTCUSDT', 'DOTUSDT'];
const names = ['Bitcoin', 'Ethereum', 'Binance Coin', 'Ripple', 'Cardano', 'Binance USD', 'Dogecoin', 'Solana', 'Litecoin', 'Polkadot'];

const binanceApi = async () => {
    try {
        for (let i = 0; i < symbols.length; i++) {
            const symbol = symbols[i];
            const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
            const data = await response.json();
            document.querySelector(`.cripto_name${i + 1}`).textContent = names[i];
            document.querySelector(`.cripto_price${i + 1}`).textContent = parseFloat(data.lastPrice).toFixed(2);
            document.querySelector(`.cripto_vol${i + 1}`).textContent = parseFloat(data.volume).toFixed(2);
            document.querySelector(`.cripto_high${i + 1}`).textContent = parseFloat(data.highPrice).toFixed(2);
            document.querySelector(`.cripto_low${i + 1}`).textContent = parseFloat(data.lowPrice).toFixed(2);

            

        }
    } catch (error) {
        console.error(error);
    }
};










window.addEventListener('load', binanceApi);





