const ctx = document.getElementById('myChart');

const chartApi = async () => {
    try {
        const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=30`);
        const data = await response.json();
        const labels = data.map(d => new Date(d[0]).toLocaleDateString());
        const prices = data.map(d => parseFloat(d[4]));
        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Bitcoin',
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
                    yAxes: [{
                        ticks: {
                            callback: function(value, index, values) {
                                return '$' + value;
                            }
                        }
                    }]
                }
            }
        });
    } catch (error) {
        console.error(error);
    }
};

window.addEventListener('load', chartApi);
