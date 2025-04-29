import React, { useState, useEffect, useRef } from "react";
import { getMultipleTickers } from "../services/binanceApi";
import { symbols, names } from "../constants/cryptos";

export const CryptoTable = ({ onSelectCrypto }) => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const tableRef = useRef(null);

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      const data = await getMultipleTickers(symbols);
      if (data) {
        setCryptoData(data);
        setError(null);
      }
    } catch (error) {
      console.error("Error fetching crypto data:", error);
      setError("Error al cargar los datos de las criptomonedas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCryptoSelect = (crypto) => {
    setSelectedCrypto(crypto);
    if (onSelectCrypto) {
      onSelectCrypto(crypto);
    }
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="crypto-table-container" ref={tableRef}>
      <style jsx>{`
        .crypto-table-container {
          background: var(--card-background);
          border-radius: var(--border-radius);
          padding: 2rem;
          margin: 2rem 0;
          box-shadow: var(--box-shadow);
        }

        .crypto-table-container h2 {
          color: var(--text-color);
          font-size: 1.5rem;
          margin-bottom: 2rem;
          text-align: center;
          font-weight: 600;
        }

        .crypto-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }

        .crypto-table th,
        .crypto-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .crypto-table th {
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .crypto-table td {
          color: var(--text-color);
          font-size: 1rem;
        }

        .crypto-table tr:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .crypto-table tr.selected {
          background: rgba(0, 200, 83, 0.1);
        }

        .crypto-table tr.selected td {
          color: var(--accent-color);
        }

        .crypto-name {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .crypto-symbol {
          font-weight: 600;
        }

        .crypto-full-name {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .price-change.positive {
          color: var(--accent-color);
        }

        .price-change.negative {
          color: #ff1744;
        }

        .loading-container,
        .error-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          color: var(--text-secondary);
        }

        .error-container {
          color: #ff1744;
        }
      `}</style>
      <h2>Precios de Criptomonedas</h2>
      {loading ? (
        <div className="loading-container">Cargando datos...</div>
      ) : error ? (
        <div className="error-container">{error}</div>
      ) : (
        <table className="crypto-table">
          <thead>
            <tr>
              <th>Criptomoneda</th>
              <th>Precio Actual</th>
              <th>Cambio 24h</th>
              <th>Volumen 24h</th>
            </tr>
          </thead>
          <tbody>
            {cryptoData.map((crypto, index) => (
              <tr
                key={crypto.symbol}
                className={selectedCrypto === crypto.symbol ? "selected" : ""}
                onClick={() => handleCryptoSelect(crypto.symbol)}
              >
                <td>
                  <div className="crypto-name">
                    <span className="crypto-symbol">{crypto.symbol}</span>
                    <span className="crypto-full-name">{names[index]}</span>
                  </div>
                </td>
                <td>${parseFloat(crypto.lastPrice).toFixed(2)}</td>
                <td className={`price-change ${parseFloat(crypto.priceChangePercent) >= 0 ? "positive" : "negative"}`}>
                  {parseFloat(crypto.priceChangePercent).toFixed(2)}%
                </td>
                <td>${parseFloat(crypto.volume).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}; 