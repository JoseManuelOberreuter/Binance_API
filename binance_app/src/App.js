import './Components';
import { Header, Chart, Table } from './Components';
import CryptoInfo  from './ApiBinance'



function App() {
  return (
    <>
      <Header />
      <Chart />
      <Table />

      <CryptoInfo />
      <Chart />

    </>
  );
}

export default App;
