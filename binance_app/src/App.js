// App.js
import React from 'react';
import { Header, Chart, Table } from './Components';
import ApiTable  from './ApiBinance';

function App() {
  return (
    <>
      <Header />
      <Chart />
      <Table />
      <ApiTable />
    </>
  );
}

export default App;
