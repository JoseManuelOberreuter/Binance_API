// App.js
import React from 'react';
import { Header, ChartComponent, Table } from './Components';
import ApiTable  from './ApiBinance';

function App() {
  return (
    <>
      <Header />
      <ChartComponent />
      <Table />
      <ApiTable />
    </>
  );
}

export default App;
