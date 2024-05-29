import React, { useState } from 'react';
import './App.css';
import Header from './components2/Header';
import Footer from './components2/Footer';
import DatasetUpload from './components2/DatasetUpload';
import DatasetList from './components2/DatasetList';
import AxisSelection from './components2/AxisSelection';
import ChartComponent from './components2/Chart';

function App() {
  const [datasets, setDatasets] = useState([]);
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [referenceDataset, setReferenceDataset] = useState('');
  const [datasetColors, setDatasetColors] = useState({});

  const addDataset = (dataset) => {
    setDatasets([...datasets, dataset]);
  };

  const removeDataset = (fileName) => {
    setDatasets(datasets.filter(dataset => dataset !== fileName));
  };

  const setDatasetColor = (fileName, color) => {
    setDatasetColors({
      ...datasetColors,
      [fileName]: color
    });
  };

  return (
    <div className="App">
      <Header />
      <main>
        <DatasetUpload addDataset={addDataset} />
        <DatasetList 
          datasets={datasets} 
          removeDataset={removeDataset} 
          setDatasetColor={setDatasetColor} 
          yAxis={yAxis}
        />
        {datasets.length > 0 && (
          <>
            <div className="flex-container">
              <div className="flex-item">
                <AxisSelection setXAxis={setXAxis} setYAxis={setYAxis} datasets={datasets} />
              </div>
              <div className="flex-item">
                <label className="label" htmlFor="reference-dataset">Select Reference Dataset:</label>
                <select id="reference-dataset" onChange={(e) => setReferenceDataset(e.target.value)} defaultValue="">
                  <option value="" disabled>Select Reference Dataset</option>
                  {datasets.map(dataset => (
                    <option key={dataset} value={dataset}>{dataset}</option>
                  ))}
                </select>
              </div>
            </div>
            {xAxis && yAxis && referenceDataset && (
              <ChartComponent 
                datasets={datasets} 
                xAxis={xAxis} 
                yAxis={yAxis} 
                referenceDataset={referenceDataset} 
                datasetColors={datasetColors} 
              />
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
