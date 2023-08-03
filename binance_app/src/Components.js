import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Chart from "chart.js/auto";

export function ChartComponent() {
  const [bitcoinData, setBitcoinData] = useState({});
  const chartRef = useRef(null); // Ref para el canvas

  useEffect(() => {
    // Hacer la solicitud a la API de Binance para obtener los datos de Bitcoin
    axios
      .get("https://api.binance.com/api/v3/ticker/price", {
        params: {
          symbol: "BTCUSDT", // BTCUSDT es el par de trading de Bitcoin en Binance
        },
      })
      .then((response) => {
        setBitcoinData(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener datos de Bitcoin desde la API:", error);
      });
  }, []);

  useEffect(() => {
    // Crea el gráfico cuando los datos de Bitcoin estén disponibles
    if (Object.keys(bitcoinData).length > 0 && chartRef.current) {
      createChart(chartRef.current, bitcoinData.price); // Pasamos el precio de Bitcoin al crear el gráfico
    }
  }, [bitcoinData]);

  const createChart = (canvas, price) => {
    if (canvas && canvas.getContext) {
      if (window.myChart) {
        // Destruir el gráfico existente antes de crear uno nuevo
        window.myChart.destroy();
      }

      const ctx = canvas.getContext("2d");
      window.myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Precio"],
          datasets: [
            {
              label: "Precio de Bitcoin",
              data: [price],
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
      <canvas ref={chartRef} width="400" height="200"></canvas>
      <div>
        <p>
          <strong>Símbolo:</strong> {bitcoinData.symbol}
        </p>
        <p>
          <strong>Precio:</strong> {bitcoinData.price}
        </p>
        {/* Agrega más datos aquí */}
      </div>
    </div>
  );
}




    
// Función auxiliar para obtener los milisegundos correspondientes a un intervalo
function getMillisecondsForInterval(interval) {
  const intervals = {
    '1w': 7 * 24 * 60 * 60 * 1000, // 1 semana en milisegundos
    '1M': 30 * 24 * 60 * 60 * 1000, // 1 mes en milisegundos
    '1y': 365 * 24 * 60 * 60 * 1000, // 1 año en milisegundos
    '1d': 24 * 60 * 60 * 1000, // 1 día en milisegundos
  };

  return intervals[interval];
}

// componente select 
function SelectTime(){
    return(
        <select id="select_time" class="btn btn-bg btn-outline-secondary dropdown-toggle">
            <option value="This week">This week</option>
            <option value="This month">This month</option>
            <option value="This year">This year</option>
            <option value="All" selected>All time</option>
        </select>
    )
}

export function Header(){
    return(
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Bitcoin</h1>
            <div class="btn-toolbar mb-2 mb-md-0">
                <SelectTime />
            </div>
        </div>
    )
};


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

