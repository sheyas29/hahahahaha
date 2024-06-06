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
  const [xMin, setXMin] = useState(null);
  const [xMax, setXMax] = useState(null);
  const [yMin, setYMin] = useState(null);
  const [yMax, setYMax] = useState(null);

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

  const resetScales = () => {
    setXMin(null);
    setXMax(null);
    setYMin(null);
    setYMax(null);
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
            <div className="flex-container">
              <div className="flex-item">
                <label className="label" htmlFor="x-min">X Axis Min:</label>
                <input type="number" id="x-min" value={xMin || ''} onChange={(e) => setXMin(e.target.value)} />
              </div>
              <div className="flex-item">
                <label className="label" htmlFor="x-max">X Axis Max:</label>
                <input type="number" id="x-max" value={xMax || ''} onChange={(e) => setXMax(e.target.value)} />
              </div>
              <div className="flex-item">
                <label className="label" htmlFor="y-min">Y Axis Min:</label>
                <input type="number" id="y-min" value={yMin || ''} onChange={(e) => setYMin(e.target.value)} />
              </div>
              <div className="flex-item">
                <label className="label" htmlFor="y-max">Y Axis Max:</label>
                <input type="number" id="y-max" value={yMax || ''} onChange={(e) => setYMax(e.target.value)} />
              </div>
              <div className="flex-item">
                <button onClick={resetScales}>Reset Scales</button>
              </div>
            </div>
            {xAxis && yAxis && referenceDataset && (
              <ChartComponent 
                datasets={datasets} 
                xAxis={xAxis} 
                yAxis={yAxis} 
                referenceDataset={referenceDataset} 
                datasetColors={datasetColors} 
                xMin={xMin}
                xMax={xMax}
                yMin={yMin}
                yMax={yMax}
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
