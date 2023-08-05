// App.js
import React from 'react';
import {  ChartComponent, Table } from './Components';
import ApiTable  from './ApiBinance';

function App() {
  return (
    <>
      <ChartComponent />
      <Table />
      <ApiTable />
    </>
  );
}

export default App;
