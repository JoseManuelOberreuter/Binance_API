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
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const containerRef = useRef(null);

  // Handle window resize for responsive chart
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      
      // Adjust display format based on screen size and timeframe
      const getTimeFormat = () => {
        if (viewportWidth < 768) {
          // For mobile devices
          switch (selectedTimeframe) {
            case "1d": return "HH:mm";
            case "1w": return "dd/MM";
            case "1M": 
            case "3M": 
            case "1y": 
            case "All": return "dd/MM";
            default: return "MM/dd";
          }
        } else {
          // For larger screens
          return "MM/dd HH:mm";
        }
      };
      
      // Calculate visible labels for x-axis based on screen size
      const calculateVisibleLabels = () => {
        if (viewportWidth < 576) return 4;
        if (viewportWidth < 768) return 6;
        if (viewportWidth < 992) return 8;
        return 10;
      };
      
      const visibleLabels = calculateVisibleLabels();
      
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: bitcoinData.map(item => format(new Date(item[0]), getTimeFormat())),
          datasets: [{
            label: `${currentCryptoName} Price`,
            data: bitcoinData.map(item => parseFloat(item[4])),
            borderColor: priceChange.value >= 0 ? '#00c853' : '#ff1744',
            backgroundColor: priceChange.value >= 0 ? 'rgba(0, 200, 83, 0.1)' : 'rgba(255, 23, 68, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: viewportWidth < 768 ? 2 : 0,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              left: 5,
              right: 10,
              top: 10,
              bottom: 10
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: true,
              mode: 'index',
              intersect: false,
              callbacks: {
                label: function(context) {
                  return `${currentCryptoName}: $${context.parsed.y.toFixed(2)}`;
                }
              },
              // Make tooltip more thumb-friendly on mobile
              padding: viewportWidth < 768 ? 12 : 8,
              titleFont: {
                size: viewportWidth < 768 ? 14 : 12
              },
              bodyFont: {
                size: viewportWidth < 768 ? 14 : 12
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                maxRotation: viewportWidth < 768 ? 45 : 0,
                autoSkip: true,
                maxTicksLimit: visibleLabels,
                font: {
                  size: viewportWidth < 768 ? 10 : 12
                },
                padding: 5
              },
              border: {
                display: false
              }
            },
            y: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                font: {
                  size: viewportWidth < 768 ? 10 : 12
                },
                padding: 8,
                callback: function(value) {
                  // Acortar el formato de los números grandes
                  if (value >= 1000) {
                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  }
                  return value;
                }
              },
              // Display fewer ticks on mobile
              maxTicksLimit: viewportWidth < 768 ? 5 : 8,
              border: {
                display: false
              }
            }
          },
          // Improve touch interaction on mobile
          elements: {
            point: {
              hitRadius: viewportWidth < 768 ? 15 : 10
            }
          }
        }
      });
    }
  }, [bitcoinData, currentCryptoName, priceChange, viewportWidth, selectedTimeframe]);

  const handleTimeframeChange = (timeframe) => {
    setSelectedTimeframe(timeframe);
    fetchData(timeframe);
  };

  // Use smaller loader on mobile
  const renderLoader = () => (
    <div className="loading">
      <div className="loading-spinner"></div>
      <div className="loading-text">Cargando datos...</div>
    </div>
  );

  if (loading) {
    return (
      <div className="chart-container" ref={containerRef}>
        {renderLoader()}
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-container" ref={containerRef}>
        <div className="error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container" ref={containerRef}>
      <style jsx>{`
        .chart-container {
          background: var(--card-background);
          border-radius: var(--border-radius);
          padding: 1rem;
          margin: 1rem 0;
          box-shadow: var(--box-shadow);
          width: 100%;
          height: auto;
          min-height: 380px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        @media (min-width: 768px) {
          .chart-container {
            padding: 2rem;
            margin: 2rem 0;
            min-height: 450px;
          }
        }

        .chart-header {
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;
        }

        @media (min-width: 576px) {
          .chart-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
          }
        }

        .chart-title {
          margin-bottom: 0.5rem;
        }

        @media (min-width: 576px) {
          .chart-title {
            margin-bottom: 0;
          }
        }

        .chart-header h2 {
          color: var(--text-color);
          font-size: 1.2rem;
          margin: 0;
        }

        @media (min-width: 768px) {
          .chart-header h2 {
            font-size: 1.5rem;
          }
        }

        .price-info {
          margin-top: 0.5rem;
          font-size: 1rem;
        }

        .timeframe-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.75rem;
          margin-bottom: 1.25rem;
        }

        @media (min-width: 576px) {
          .timeframe-buttons {
            margin-top: 0;
            margin-bottom: 0;
          }
        }

        .timeframe-button {
          background: var(--secondary-color);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--border-radius);
          padding: 0.5rem;
          min-width: 3rem;
          text-align: center;
          color: var(--text-color);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s ease;
          touch-action: manipulation;
        }

        @media (min-width: 768px) {
          .timeframe-button {
            font-size: 0.9rem;
            min-width: 4rem;
          }
        }

        .timeframe-button.active {
          background: var(--accent-color);
          border-color: var(--accent-color);
          color: #fff;
        }

        .timeframe-button:hover {
          border-color: var(--accent-color);
        }

        .timeframe-button:active {
          transform: scale(0.95);
        }

        .loading, .error {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 250px;
          color: var(--text-secondary);
        }

        @media (min-width: 768px) {
          .loading, .error {
            min-height: 300px;
          }
        }

        .loading-spinner {
          width: 30px;
          height: 30px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          border-top-color: var(--accent-color);
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .loading-text {
          font-size: 0.9rem;
        }

        .error {
          color: #ff1744;
          text-align: center;
          padding: 0 1rem;
        }

        .canvas-container {
          width: 100%;
          flex: 1;
          height: 300px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
          padding-bottom: 0.5rem;
        }

        canvas {
          width: 100% !important;
          height: 100% !important;
          max-height: 350px;
        }

        @media (min-width: 768px) {
          .canvas-container {
            height: 350px;
          }
          
          canvas {
            max-height: 400px;
          }
        }
      `}</style>
      <div className="chart-header">
        <div className="chart-title">
          <h2>{currentCryptoName}</h2>
          <div className="price-info" style={{ 
            color: priceChange.value >= 0 ? '#00c853' : '#ff1744',
          }}>
            ${parseFloat(bitcoinData[bitcoinData.length - 1][4]).toFixed(2)} 
            <span style={{ marginLeft: '0.5rem' }}>
              {priceChange.value >= 0 ? '↑' : '↓'} 
              {Math.abs(priceChange.percentage).toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="timeframe-buttons">
          {[
            { value: "1d", label: "24h" },
            { value: "1w", label: "1w" },
            { value: "1M", label: "1M" },
            { value: "3M", label: "3M" },
            { value: "1y", label: "1y" },
            { value: "All", label: "All" }
          ].map(option => (
            <button
              key={option.value}
              className={`timeframe-button ${selectedTimeframe === option.value ? 'active' : ''}`}
              onClick={() => handleTimeframeChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="canvas-container">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}); 