import axios from 'axios';

// Configuración de axios
const binanceApi = axios.create({
  baseURL: 'https://api.binance.com/api/v3',
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
binanceApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      switch (error.response.status) {
        case 429:
          console.error('Rate limit excedido. Por favor, espera un momento.');
          break;
        case 418:
          console.error('IP ha sido baneada temporalmente por exceder el rate limit.');
          break;
        case 400:
          console.error('Solicitud inválida:', error.response.data);
          break;
        case 401:
          console.error('No autorizado. Verifica tus credenciales.');
          break;
        case 403:
          console.error('Acceso prohibido.');
          break;
        case 404:
          console.error('Recurso no encontrado.');
          break;
        case 500:
          console.error('Error interno del servidor.');
          break;
        default:
          console.error('Error en la respuesta:', error.response.data);
      }
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor:', error.request);
    } else {
      // Ocurrió un error al configurar la solicitud
      console.error('Error al configurar la solicitud:', error.message);
    }
    return Promise.reject(error);
  }
);

// Función para obtener datos de klines
export const getKlines = async (symbol, interval, limit) => {
  try {
    const response = await binanceApi.get('/klines', {
      params: {
        symbol,
        interval,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener datos de klines: ${error.message}`);
  }
};

// Función para obtener datos de ticker de 24h
export const getTicker24h = async (symbol) => {
  try {
    const response = await binanceApi.get('/ticker/24hr', {
      params: { symbol },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error al obtener datos de ticker: ${error.message}`);
  }
};

// Función para obtener datos de múltiples tickers
export const getMultipleTickers = async (symbols) => {
  try {
    const promises = symbols.map(symbol => getTicker24h(symbol));
    return await Promise.all(promises);
  } catch (error) {
    throw new Error(`Error al obtener datos de múltiples tickers: ${error.message}`);
  }
}; 