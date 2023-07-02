// Define un arreglo de símbolos para diferentes criptomonedas
const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT', 'MATICUSDT', 'DOGEUSDT', 'SOLUSDT', 'LTCUSDT', 'DOTUSDT'];

// Define un arreglo de nombres para las criptomonedas correspondientes a los símbolos
const names = ['Bitcoin', 'Ethereum', 'Binance Coin', 'Ripple', 'Cardano', 'Polygon', 'Dogecoin', 'Solana', 'Litecoin', 'Polkadot'];

const links = [
  '/index.html',
  '/view/ethereum.html',
  '/view/binance_coin.html',
  '/view/ripple.html',
  '/view/cardano.html',
  '/view/polygon.html',
  '/view/dogecoin.html',
  '/view/solana.html',
  '/view/litecoin.html',
  '/view/polkadot.html',
];

// Define una función asíncrona para llamar a la API de Binance
const binanceApi = async () => {
  try {
    // Itera sobre el arreglo de símbolos
    for (let i = 0; i < symbols.length; i++) {
      // Obtiene el símbolo actual
      const symbol = symbols[i];
      // Realiza una solicitud a la API de Binance para obtener información sobre el símbolo actual
      const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
      // Convierte la respuesta en un objeto JSON
      const data = await response.json();
      // Actualiza el contenido del elemento con la clase `.cripto_name${i + 1}` con el nombre de la criptomoneda correspondiente
      const nameElement = document.querySelector(`.cripto_name${i + 1}`);
      nameElement.textContent = names[i];
      // Crea un elemento de enlace
      const linkElement = document.createElement('a');
      linkElement.href = links[i];
      linkElement.textContent = names[i];
      // Reemplaza el contenido del elemento de nombre con el enlace
      nameElement.innerHTML = '';
      nameElement.appendChild(linkElement);
      // Actualiza el contenido del elemento con la clase `.cripto_price${i + 1}` con el último precio de la criptomoneda, formateado con dos decimales
      document.querySelector(`.cripto_price${i + 1}`).textContent = parseFloat(data.lastPrice).toFixed(2);
      // Actualiza el contenido del elemento con la clase `.cripto_vol${i + 1}` con el volumen de la criptomoneda, formateado con dos decimales
      document.querySelector(`.cripto_vol${i + 1}`).textContent = parseFloat(data.volume).toFixed(2);
      // Actualiza el contenido del elemento con la clase `.cripto_high${i + 1}` con el precio más alto de la criptomoneda, formateado con dos decimales
      document.querySelector(`.cripto_high${i + 1}`).textContent = parseFloat(data.highPrice).toFixed(2);
      // Actualiza el contenido del elemento con la clase `.cripto_low${i + 1}` con el precio más bajo de la criptomoneda, formateado con dos decimales
      document.querySelector(`.cripto_low${i + 1}`).textContent = parseFloat(data.lowPrice).toFixed(2);
    }
  } catch (error) {
    // Si ocurre un error, se muestra en la consola
    console.error(error);
  }
};

// Agrega un evento al objeto `window` para llamar a la función `binanceApi` cuando se cargue la página
window.addEventListener('load', binanceApi);
