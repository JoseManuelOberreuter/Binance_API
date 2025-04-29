import { useState } from 'react';
import './App.css';
import { ChartComponent } from "./components/Chart";
import { CryptoTable } from "./components/CryptoTable";
import { Calculator } from "./components/Calculator";
import { symbols, names } from "./constants/cryptos";

function App() {
  const [selectedCryptoIndex, setSelectedCryptoIndex] = useState(0);
  const [selectedCryptoSymbol, setSelectedCryptoSymbol] = useState("BTCUSDT");
  const [currentCryptoName, setCurrentCryptoName] = useState("Bitcoin");

  const handleCryptoSelect = (crypto) => {
    const index = symbols.indexOf(crypto);
    if (index !== -1) {
      setSelectedCryptoIndex(index);
      setSelectedCryptoSymbol(crypto);
      setCurrentCryptoName(names[index]);
    }
  };

  return (
    <div className="App">
      <ChartComponent 
        selectedCryptoIndex={selectedCryptoIndex}
        selectedCryptoSymbol={selectedCryptoSymbol}
        currentCryptoName={currentCryptoName}
        setSelectedCryptoIndex={setSelectedCryptoIndex}
        setSelectedCryptoSymbol={setSelectedCryptoSymbol}
        setCurrentCryptoName={setCurrentCryptoName}
      />
      <Calculator selectedCrypto={selectedCryptoSymbol} />
      <CryptoTable onSelectCrypto={handleCryptoSelect} />
    </div>
  );
}

export default App;
