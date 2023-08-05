import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import { format } from "date-fns";




export function SelectTime({ onChange }) {
  const [selectedOption, setSelectedOption] = useState("All");

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    onChange(selectedValue);
  };

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
}





export function ChartComponent() {
  const [bitcoinData, setBitcoinData] = useState([]);
  const chartRef = useRef(null); // Ref para el canvas

  const handleSelectTimeChange = (selectedOption) => {
    let interval = "1d";
    let limit = 30;

    if (selectedOption === "This week") {
      interval = "1d";
      limit = 7;
    } else if (selectedOption === "This month") {
      interval = "1d";
      limit = 32;
    } else if (selectedOption === "This year") {
        interval = "1M"; // Intervalo de 1 mes
        limit = 13; // Limitar a 12 meses    
    } else if (selectedOption === "All") {
      interval = "1M";
      limit = 100;
    }

    fetchBitcoinData(interval, limit);
  };

  const fetchBitcoinData = (interval, limit) => {
    axios
      .get("https://api.binance.com/api/v3/klines", {
        params: {
          symbol: "BTCUSDT", // BTCUSDT es el par de trading de Bitcoin en Binance
          interval: interval,
          limit: limit,
        },
      })
      .then((response) => {
        const historicalData = response.data.map((item) => ({
          date: new Date(item[0]),
          price: parseFloat(item[4]),
        }));
        setBitcoinData(historicalData);
      })
      .catch((error) => {
        console.error("Error al obtener datos históricos de Bitcoin desde la API:", error);
      });
  };

  useEffect(() => {
    // Por defecto, inicia con la opción "All time"
    fetchBitcoinData("1M", 100);
  }, []);

  useEffect(() => {
    // Crea el gráfico cuando los datos históricos de Bitcoin estén disponibles
    if (bitcoinData.length > 0 && chartRef.current) {
      createChart(chartRef.current, bitcoinData); // Pasamos los datos históricos al crear el gráfico
    }
  }, [bitcoinData]);

  const formatDate = (date) => format(date, "dd/MM/yy");

  const createChart = (canvas, data) => {
    if (canvas && canvas.getContext) {
      if (window.myChart) {
        // Destruir el gráfico existente antes de crear uno nuevo
        window.myChart.destroy();
      }

      const ctx = canvas.getContext("2d");
      window.myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: data.map((item) => formatDate(item.date)),
          datasets: [
            {
              label: "Precio de Bitcoin",
              data: data.map((item) => item.price),
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
              fill: false,
            },
          ],
        },
      });
    }
  };

  return (
    <div>
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">Bitcoin</h1>
        <div class="btn-toolbar mb-2 mb-md-0">

            <SelectTime onChange={handleSelectTimeChange}/>
        

        </div>
      </div>
      <canvas ref={chartRef} width="400" height="200"></canvas>
    </div>
  );
}


    


  


export function Table(){
    return(
        <>
            <h2 class="mt-5">Cryptocurrencies</h2>
            <div class="table-responsive mb-5">
                <table class="table table-striped table-sm">
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
                        <tr>
                            <td class="cripto_name1"></td>
                            <td class="cripto_price1"></td>
                            <td class="cripto_vol1"></td>
                            <td class="cripto_high1"></td>
                            <td class="cripto_low1"></td>
                        </tr>
                        <tr>
                            <td class="cripto_name2"></td>
                            <td class="cripto_price2"></td>
                            <td class="cripto_vol2"></td>
                            <td class="cripto_high2"></td>
                            <td class="cripto_low2"></td>
                        </tr>
                        <tr>
                            <td class="cripto_name3"></td>
                            <td class="cripto_price3"></td>
                            <td class="cripto_vol3"></td>
                            <td class="cripto_high3"></td>
                            <td class="cripto_low3"></td>
                        </tr>
                        <tr>
                            <td class="cripto_name4"></td>
                            <td class="cripto_price4"></td>
                            <td class="cripto_vol4"></td>
                            <td class="cripto_high4"></td>
                            <td class="cripto_low4"></td>
                        </tr>
                        <tr>
                            <td class="cripto_name5"></td>
                            <td class="cripto_price5"></td>
                            <td class="cripto_vol5"></td>
                            <td class="cripto_high5"></td>
                            <td class="cripto_low5"></td>
                        </tr>
                        <tr>
                            <td class="cripto_name6"></td>
                            <td class="cripto_price6"></td>
                            <td class="cripto_vol6"></td>
                            <td class="cripto_high6"></td>
                            <td class="cripto_low6"></td>
                        </tr>
                        <tr>
                            <td class="cripto_name7"></td>
                            <td class="cripto_price7"></td>
                            <td class="cripto_vol7"></td>
                            <td class="cripto_high7"></td>
                            <td class="cripto_low7"></td>
                        </tr>
                        <tr>
                            <td class="cripto_name8"></td>
                            <td class="cripto_price8"></td>
                            <td class="cripto_vol8"></td>
                            <td class="cripto_high8"></td>
                            <td class="cripto_low8"></td>
                        </tr>
                        <tr>
                            <td class="cripto_name9"></td>
                            <td class="cripto_price9"></td>
                            <td class="cripto_vol9"></td>
                            <td class="cripto_high9"></td>
                            <td class="cripto_low9"></td>
                        </tr>
                        <tr>
                            <td class="cripto_name10"></td>
                            <td class="cripto_price10"></td>
                            <td class="cripto_vol10"></td>
                            <td class="cripto_high10"></td>
                            <td class="cripto_low10"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
};



const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT', 'MATICUSDT', 'DOGEUSDT', 'SOLUSDT', 'LTCUSDT', 'DOTUSDT'];
const names = ['Bitcoin', 'Ethereum', 'Binance Coin', 'Ripple', 'Cardano', 'Polygon', 'Dogecoin', 'Solana', 'Litecoin', 'Polkadot'];

export const ApiTable = () => {
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

