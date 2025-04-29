import React, { useState, useEffect, memo } from "react";
import { getMultipleTickers } from "../services/binanceApi";
import { symbols, names } from "../constants/cryptos";

export const Calculator = memo(({ selectedCrypto: propSelectedCrypto }) => {
  const [investment, setInvestment] = useState('');
  const [entryPrice, setEntryPrice] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [targetType, setTargetType] = useState('percentage');
  const [useCurrentPrice, setUseCurrentPrice] = useState(true);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [result, setResult] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState(propSelectedCrypto || 'BTCUSDT');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (propSelectedCrypto) {
      setSelectedCrypto(propSelectedCrypto);
      setResult(null);
    }
  }, [propSelectedCrypto]);

  const fetchCurrentPrice = async () => {
    try {
      setLoading(true);
      const data = await getMultipleTickers([selectedCrypto]);
      if (data && data[0]) {
        setCurrentPrice(parseFloat(data[0].lastPrice));
        if (useCurrentPrice) {
          setEntryPrice(data[0].lastPrice);
        }
      }
    } catch (error) {
      console.error("Error fetching current price:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentPrice();
    const interval = setInterval(fetchCurrentPrice, 30000);
    return () => clearInterval(interval);
  }, [selectedCrypto]);

  const calculateProfit = () => {
    if (!investment || !entryPrice || !targetValue) return;

    const inv = parseFloat(investment);
    const entry = parseFloat(entryPrice);
    let exit;

    if (targetType === 'percentage') {
      const percentage = parseFloat(targetValue);
      exit = entry * (1 + (percentage / 100));
    } else {
      exit = parseFloat(targetValue);
    }

    if (isNaN(inv) || isNaN(entry) || isNaN(exit)) return;

    const coins = inv / entry;
    const profit = (exit - entry) * coins;
    const profitPercentage = (profit / inv) * 100;
    const total = inv + profit;

    setResult({
      profit,
      profitPercentage,
      total,
      coins,
      targetPrice: exit
    });
  };

  const handleInputChange = (e, setter) => {
    const value = e.target.value.replace(/[^0-9.-]/g, '');
    setter(value);
    setResult(null);
  };

  return (
    <div className="calculator-container">
      <style jsx>{`
        .calculator-container {
          background: var(--card-background);
          border-radius: var(--border-radius);
          padding: 2rem;
          margin: 2rem 0;
          box-shadow: var(--box-shadow);
        }

        .calculator-container h2 {
          color: var(--text-color);
          font-size: 1.5rem;
          margin-bottom: 2rem;
          text-align: center;
          font-weight: 600;
        }

        .calculator-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 500px;
          margin: 0 auto;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .input-group select,
        .input-group input {
          background: var(--secondary-color);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--border-radius);
          padding: 0.75rem 1rem;
          color: var(--text-color);
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .input-group select:focus,
        .input-group input:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 2px rgba(0, 200, 83, 0.2);
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .checkbox-group input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: var(--accent-color);
        }

        .checkbox-group label {
          color: var(--text-secondary);
          font-size: 0.9rem;
          cursor: pointer;
        }

        .current-price {
          background: rgba(0, 200, 83, 0.1);
          color: var(--accent-color);
          padding: 0.75rem;
          border-radius: var(--border-radius);
          font-weight: 600;
          text-align: center;
        }

        .target-input-container {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .target-input-container input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: var(--secondary-color);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--border-radius);
          color: var(--text-color);
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .target-input-container input:focus {
          outline: none;
          border-color: var(--accent-color);
          box-shadow: 0 0 0 2px rgba(0, 200, 83, 0.2);
        }

        .target-type-selector {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          width: 100%;
        }
        
        .target-type-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--border-radius);
          background: var(--secondary-color);
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        
        .target-type-button:hover {
          border-color: var(--accent-color);
        }
        
        .target-type-button.active {
          background: var(--accent-color);
          border-color: var(--accent-color);
          color: white;
        }
        
        .button-icon {
          font-weight: bold;
          font-size: 1rem;
        }
        
        .button-label {
          font-weight: 500;
        }

        .calculate-button {
          background: var(--accent-color);
          color: white;
          border: none;
          border-radius: var(--border-radius);
          padding: 1rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
        }

        .calculate-button:hover {
          background: #00b34a;
          transform: translateY(-1px);
        }

        .calculate-button:disabled {
          background: var(--secondary-color);
          cursor: not-allowed;
          transform: none;
        }

        .result-container {
          background: rgba(255, 255, 255, 0.05);
          border-radius: var(--border-radius);
          padding: 1.5rem;
          margin-top: 1rem;
          animation: fadeIn 0.3s ease;
        }

        .result-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .result-item:last-child {
          border-bottom: none;
        }

        .result-item span:first-child {
          color: var(--text-secondary);
        }

        .result-item span:last-child {
          color: var(--text-color);
          font-weight: 600;
        }

        .result-item .positive {
          color: var(--accent-color);
        }

        .result-item .negative {
          color: #ff1744;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <h2>Calculadora de Beneficios</h2>
      <div className="calculator-form">
        <div className="input-group">
          <label>Criptomoneda</label>
          <select 
            value={selectedCrypto} 
            onChange={(e) => {
              setSelectedCrypto(e.target.value);
              setResult(null);
            }}
          >
            {symbols.map((symbol, index) => (
              <option key={symbol} value={symbol}>
                {names[index]}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Inversión Inicial (USD)</label>
          <input
            type="text"
            value={investment}
            onChange={(e) => handleInputChange(e, setInvestment)}
            placeholder="Ej: 1000"
          />
        </div>

        <div className="input-group">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="useCurrentPrice"
              checked={useCurrentPrice}
              onChange={(e) => {
                setUseCurrentPrice(e.target.checked);
                if (e.target.checked && currentPrice) {
                  setEntryPrice(currentPrice.toString());
                }
              }}
            />
            <label htmlFor="useCurrentPrice">Usar precio actual</label>
          </div>
          {!useCurrentPrice && (
            <input
              type="text"
              value={entryPrice}
              onChange={(e) => handleInputChange(e, setEntryPrice)}
              placeholder="Precio de entrada"
            />
          )}
          {useCurrentPrice && currentPrice && (
            <div className="current-price">
              Precio actual: ${currentPrice.toFixed(2)}
            </div>
          )}
        </div>

        <div className="input-group">
          <div className="target-input-container">
            <div className="target-type-selector">
              <button 
                className={`target-type-button ${targetType === 'percentage' ? 'active' : ''}`}
                onClick={() => setTargetType('percentage')}
                title="Calcular por porcentaje"
              >
                <span className="button-icon">%</span>
                <span className="button-label">Porcentaje</span>
              </button>
              <button 
                className={`target-type-button ${targetType === 'price' ? 'active' : ''}`}
                onClick={() => setTargetType('price')}
                title="Calcular por precio"
              >
                <span className="button-icon">$</span>
                <span className="button-label">Precio</span>
              </button>
            </div>
            <input
              type="text"
              value={targetValue}
              onChange={(e) => handleInputChange(e, setTargetValue)}
              placeholder={targetType === 'percentage' ? "Ej: 10 para 10% de ganancia" : "Precio objetivo"}
            />
          </div>
        </div>

        <button 
          className="calculate-button"
          onClick={calculateProfit}
          disabled={!investment || !entryPrice || !targetValue || loading}
        >
          {loading ? 'Cargando...' : 'Calcular Beneficio'}
        </button>

        {result && (
          <div className="result-container">
            <div className="result-item">
              <span>Cantidad de {names[symbols.indexOf(selectedCrypto)]}:</span>
              <span>{result.coins.toFixed(8)}</span>
            </div>
            <div className="result-item">
              <span>Precio Objetivo:</span>
              <span>${result.targetPrice.toFixed(2)}</span>
            </div>
            <div className="result-item">
              <span>Beneficio/Pérdida:</span>
              <span className={result.profit >= 0 ? 'positive' : 'negative'}>
                ${Math.abs(result.profit).toFixed(2)} ({result.profitPercentage.toFixed(2)}%)
              </span>
            </div>
            <div className="result-item">
              <span>Valor Total:</span>
              <span>${result.total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}); 