// Obtiene el elemento del DOM con el id 'myChart'
const ctx = document.getElementById('myChart');
const selectElement = document.querySelector('#select_time');

// Define la variable para almacenar el gráfico
let myChart;

// Define una función asíncrona para llamar a la API de Binance y crear un gráfico
const chartApi = async () => {
    try {
        // Obtiene el valor seleccionado del select
        const selectedOption = selectElement.value;

        let interval;
        let limit;

        switch (selectedOption) {
            case 'This week':
                interval = '1d';
                limit = 8;
                break;
            case 'This month':
                interval = '1d';
                limit = 31;
                break;
            case 'This year':
                interval = '1M';
                limit = 13; // Aproximadamente 52 semanas en un año
                break;
            case 'All':
                interval = '1M';
                limit = 100; // Un número lo suficientemente grande para obtener todos los datos disponibles
                break;
            default:
                interval = '1M';
                limit = 100; // Un número lo suficientemente grande para obtener todos los datos disponibles
                break;
        }

        const endDate = new Date(); // Fecha de hoy
        const startDate = new Date(endDate.getTime() - (limit - 1) * getMillisecondsForInterval(interval));

        const startTime = startDate.getTime();
        const endTime = endDate.getTime();

        // Realiza una solicitud a la API de Binance con el intervalo correspondiente
        const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=MATICUSDT&interval=${interval}&startTime=${startTime}&endTime=${endTime}`);
        // Convierte la respuesta en un objeto JSON
        const data = await response.json();
        // Crea un arreglo de etiquetas con las fechas formateadas como cadenas
        const labels = data.map(d => {
            const date = new Date(d[0]);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear().toString().slice(-2);
            return `${day}/${month}/${year}`;
        });

        // Crea un arreglo con los precios de cierre de cada día
        const prices = data.map(d => parseFloat(d[4]));

        // Destruye el gráfico existente si ya existe
        if (myChart) {
            myChart.destroy();
        }

        // Crea un nuevo gráfico de línea utilizando la biblioteca Chart.js
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Polygon',
                    data: prices,
                    lineTension: 0,
                    backgroundColor: 'transparent',
                    borderColor: '#007bff',
                    borderWidth: 4,
                    pointBackgroundColor: '#007bff'
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: true
                    },
                    tooltip: {
                        boxPadding: 3
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            callback: function (value, index, values) {
                                // Formatea las etiquetas del eje y como valores monetarios
                                return '$' + value;
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        // Si ocurre un error, se muestra en la consola
        console.error(error);
    }
};

// Agrega un evento de cambio al elemento select
selectElement.addEventListener('change', chartApi);

// Llama a la función `chartApi` inicialmente para crear el gráfico
chartApi();

// Función auxiliar para obtener los milisegundos correspondientes a un intervalo
function getMillisecondsForInterval(interval) {
    const intervals = {
        '1w': 7 * 24 * 60 * 60 * 1000, // 1 semana en milisegundos
        '1M': 30 * 24 * 60 * 60 * 1000, // 1 mes en milisegundos
        '1y': 365 * 24 * 60 * 60 * 1000, // 1 año en milisegundos
        '1d': 24 * 60 * 60 * 1000 // 1 día en milisegundos
    };

    return intervals[interval];
}
