import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import Chart from "chart.js/auto";
import { format } from "date-fns";
import { getKlines } from "../services/binanceApi";
import { symbols, names } from "../constants/cryptos";

export const ChartComponent = memo(({ 
  selectedCryptoIndex,
  selectedCryptoSymbol,
  currentCryptoName,
  setSelectedCryptoIndex,
  setSelectedCryptoSymbol,
  setCurrentCryptoName
}) => {
  const [bitcoinData, setBitcoinData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState("1d");
  const [priceChange, setPriceChange] = useState({ value: 0, percentage: 0 });
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const fetchData = useCallback(async (timeframe = selectedTimeframe) => {
    try {
      setLoading(true);
      setError(null);
      
      let interval = "1d";
      let limit = 30;

      switch (timeframe) {
        case "1d":
          interval = "1h";
          limit = 24;
          break;
        case "1w":
          interval = "4h";
          limit = 42;
          break;
        case "1M":
          interval = "1d";
          limit = 30;
          break;
        case "3M":
          interval = "1d";
          limit = 90;
          break;
        case "1y":
          interval = "1w";
          limit = 52;
          break;
        case "All":
          interval = "1M";
          limit = 100;
          break;
      }

      const data = await getKlines(selectedCryptoSymbol, interval, limit);
      setBitcoinData(data);

      // Calcular cambio de precio
      if (data.length >= 2) {
        const firstPrice = parseFloat(data[0][4]);
        const lastPrice = parseFloat(data[data.length - 1][4]);
        const change = lastPrice - firstPrice;
        const percentage = (change / firstPrice) * 100;
        setPriceChange({
          value: change,
          percentage: percentage
        });
      }
    } catch (err) {
      setError("Error al cargar los datos. Por favor, intente más tarde.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCryptoSymbol, selectedTimeframe]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (chartRef.current && bitcoinData.length > 0) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: bitcoinData.map(item => format(new Date(item[0]), 'MM/dd HH:mm')),
          datasets: [{
            label: `${currentCryptoName} Price`,
            data: bitcoinData.map(item => parseFloat(item[4])),
            borderColor: priceChange.value >= 0 ? '#00c853' : '#ff1744',
            backgroundColor: priceChange.value >= 0 ? 'rgba(0, 200, 83, 0.1)' : 'rgba(255, 23, 68, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: 'index'
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              callbacks: {
                label: function(context) {
                  return `${currentCryptoName}: $${context.parsed.y.toFixed(2)}`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                maxRotation: 0
              }
            },
            y: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            }
          }
        }
      });
    }
  }, [bitcoinData, currentCryptoName, priceChange]);

  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
    fetchData(timeframe);
  };

  if (loading) {
    return (
      <div className="chart-container">
        <div className="loading">
          Cargando datos...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-container">
        <div className="error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <style jsx>{`
        .chart-container {
          background: var(--card-background);
          border-radius: var(--border-radius);
          padding: 2rem;
          margin: 2rem 0;
          box-shadow: var(--box-shadow);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .chart-header h2 {
          color: var(--text-color);
          font-size: 1.5rem;
          margin: 0;
        }

        .timeframe-selector {
          background: var(--secondary-color);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--border-radius);
          padding: 0.5rem;
          color: var(--text-color);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .timeframe-selector:hover {
          border-color: var(--accent-color);
        }

        .timeframe-selector:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 2px rgba(0, 200, 83, 0.2);
        }

        .loading, .error {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 300px;
          color: var(--text-secondary);
        }

        .error {
          color: #ff1744;
        }
      `}</style>
      <div className="chart-header">
        <div>
          <h2>{currentCryptoName}</h2>
          <div style={{ 
            color: priceChange.value >= 0 ? '#00c853' : '#ff1744',
            marginTop: '0.5rem'
          }}>
            ${bitcoinData[bitcoinData.length - 1][4]} 
            <span style={{ marginLeft: '0.5rem' }}>
              {priceChange.value >= 0 ? '↑' : '↓'} 
              {Math.abs(priceChange.percentage).toFixed(2)}%
            </span>
          </div>
        </div>
        <select
          className="timeframe-selector"
          value={selectedTimeframe}
          onChange={(e) => handleTimeframeChange(e.target.value)}
        >
          <option value="1d">24 Horas</option>
          <option value="1w">1 Semana</option>
          <option value="1M">1 Mes</option>
          <option value="3M">3 Meses</option>
          <option value="1y">1 Año</option>
          <option value="All">Todo el tiempo</option>
        </select>
      </div>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}); 