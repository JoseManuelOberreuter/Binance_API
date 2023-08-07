This app is designed with React js, Binance Api and Bootstrap to display information about different cryptocurrencies and their price history on a chart. Here is a description of the main functions present in the code:

1. SelectTime Component: This component represents a dropdown menu that allows users to select a time period for viewing data on the chart. The available periods are "This week," "This month," "This year," and "All time." When a user selects a period, a function is triggered to update the chart data with the appropriate interval and limit.

2. ChartComponent: This component is the core of the application, responsible for displaying the Bitcoin price chart. It uses the Chart.js library to generate a line chart that shows the price history. It also interacts with the Binance API to fetch historical price data for Bitcoin and updates the chart based on the selected time period.

3. Table Component: This component displays a table with basic information about the top 10 cryptocurrencies. It shows the names, prices, volumes, and 24-hour high/low prices for each cryptocurrency.

4. ApiTable Component: This component interacts with the Binance API to fetch real-time data for the top 10 cryptocurrencies. It uses the data to update the fields in the table that display real-time prices and information for each cryptocurrency. Additionally, each row in the table contains a button that allows users to select a specific cryptocurrency and update the chart with corresponding data.

In summary, this application combines React for the user interface, Chart.js for generating the historical price chart, and the Binance API for fetching real-time data about cryptocurrencies. The components work together to provide a user experience that allows users to visualize price history and obtain updated information about various cryptocurrencies.