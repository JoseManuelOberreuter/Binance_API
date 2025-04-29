import React, { useEffect, useState, useRef, useCallback, memo } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import { format } from "date-fns";
import { getKlines, getMultipleTickers } from "./services/binanceApi";

// Componente SelectTime optimizado con memo
export const SelectTime = memo(({ onChange }) => {
  const [selectedOption, setSelectedOption] = useState("All");

  const handleOptionChange = useCallback((event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    onChange(selectedValue);
  }, [onChange]);

  return (
    <select
      id="select_time"
      className="btn btn-bg btn-outline-secondary dropdown-toggle"
      value={selectedOption}
      onChange={handleOptionChange}
    >
      <option value="This week">This week</option>
      <option value="This month">This month</option>
      <option value="This year">This year</option>
      <option value="All">All time</option>
    </select>
  );
});

// Componente ChartComponent optimizado
export const ChartComponent = memo(() => {
  const [bitcoinData, setBitcoinData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [selectedCryptoIndex, setSelectedCryptoIndex] = useState(0);
  const [selectedCryptoSymbol, setSelectedCryptoSymbol] = useState(symbols[selectedCryptoIndex]);
  const [currentCryptoName, setCurrentCryptoName] = useState(names[selectedCryptoIndex]);

  const handleSelectTimeChange = useCallback((selectedOption) => {
    let interval = "1d";
    let limit = 30;
  
    if (selectedOption === "This week") {
      interval = "1d";
      limit = 7;
    } else if (selectedOption === "This month") {
      interval = "1d";
      limit = 32;
    } else if (selectedOption === "This year") {
      interval = "1M";
      limit = 13;
    } else if (selectedOption === "All") {
      interval = "1M";
      limit = 100;
    }
  
    fetchBitcoinData(interval, limit, selectedCryptoSymbol);
  }, [selectedCryptoSymbol]);

  const fetchBitcoinData = useCallback(async (interval, limit, symbol = "BTCUSDT") => {
    setLoading(true);
    setError(null);
    try {
      const data = await getKlines(symbol, interval, limit);
      const historicalData = data.map((item) => ({
        date: new Date(item[0]),
        price: parseFloat(item[4]),
      }));
      setBitcoinData(historicalData);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching Bitcoin historical data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateChartWithCryptoData = useCallback((cryptoIndex) => {
    const selectedSymbol = symbols[cryptoIndex];
    const interval = "1M";
    const limit = 100;
    fetchBitcoinData(interval, limit, selectedSymbol);
  }, [fetchBitcoinData]);

  const handleSelectCrypto = useCallback((cryptoIndex) => {
    updateChartWithCryptoData(cryptoIndex);
    setSelectedCryptoIndex(cryptoIndex);
    setSelectedCryptoSymbol(symbols[cryptoIndex]);
    setCurrentCryptoName(names[cryptoIndex]);
  }, [updateChartWithCryptoData]);

  const formatDate = useCallback((date) => format(date, "dd/MM/yy"), []);

  const createChart = useCallback((canvas, data) => {
    if (!canvas || !canvas.getContext) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = canvas.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((item) => formatDate(item.date)),
        datasets: [
          {
            label: "Price",
            data: data.map((item) => item.price),
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 0
        },
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        }
      }
    });
  }, [formatDate]);

  useEffect(() => {
    fetchBitcoinData("1M", 100);
  }, [fetchBitcoinData]);

  useEffect(() => {
    if (bitcoinData.length > 0 && chartRef.current) {
      createChart(chartRef.current, bitcoinData);
    }
  }, [bitcoinData, createChart]);

  return (
    <div>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">{currentCryptoName}</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <SelectTime onChange={handleSelectTimeChange} />
        </div>
      </div>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div style={{ height: '400px' }}>
          <canvas ref={chartRef}></canvas>
        </div>
      )}
      <Table />
      <ApiTable onSelectCrypto={handleSelectCrypto} setCurrentCryptoName={setCurrentCryptoName} />
    </div>
  );
});

// Componente Table optimizado con memo
export const Table = memo(() => {
  return (
    <>
      <h2 className="mt-5 mb-3">Cryptocurrencies</h2>
      <div className="table-responsive mb-5">
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Volume</th>
              <th scope="col">24hr high Price</th>
              <th scope="col">24hr low Price</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(10)].map((_, i) => (
              <tr key={i}>
                <td className={`cripto_name${i + 1}`}></td>
                <td className={`cripto_price${i + 1}`}></td>
                <td className={`cripto_vol${i + 1}`}></td>
                <td className={`cripto_high${i + 1}`}></td>
                <td className={`cripto_low${i + 1}`}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
});

const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT', 'MATICUSDT', 'DOGEUSDT', 'SOLUSDT', 'LTCUSDT', 'DOTUSDT'];
const names = ['Bitcoin', 'Ethereum', 'Binance Coin', 'Ripple', 'Cardano', 'Polygon', 'Dogecoin', 'Solana', 'Litecoin', 'Polkadot'];

// Componente ApiTable optimizado
export const ApiTable = memo(({ onSelectCrypto, setCurrentCryptoName }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cryptoData, setCryptoData] = useState([]);

  const updateTableData = useCallback((data) => {
    data.forEach((item, i) => {
      const nameElement = document.querySelector(`.cripto_name${i + 1}`);
      nameElement.textContent = names[i];

      const buttonElement = document.createElement('button');
      buttonElement.className = 'crypto-button';
      buttonElement.textContent = names[i];

      nameElement.innerHTML = '';
      nameElement.appendChild(buttonElement);

      buttonElement.dataset.cryptoIndex = i;
      buttonElement.addEventListener('click', () => {
        onSelectCrypto(i);
        setCurrentCryptoName(names[i]);
      });

      document.querySelector(`.cripto_price${i + 1}`).textContent = parseFloat(item.lastPrice).toFixed(2);
      document.querySelector(`.cripto_vol${i + 1}`).textContent = parseFloat(item.volume).toFixed(2);
      document.querySelector(`.cripto_high${i + 1}`).textContent = parseFloat(item.highPrice).toFixed(2);
      document.querySelector(`.cripto_low${i + 1}`).textContent = parseFloat(item.lowPrice).toFixed(2);
    });
  }, [onSelectCrypto, setCurrentCryptoName]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMultipleTickers(symbols);
        setCryptoData(data);
        updateTableData(data);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching ticker data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [updateTableData]);

  return (
    <div>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {loading && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
});
