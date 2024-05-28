import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from './Popup';
import StatsCard from './StatsCard';

function DatasetList({ datasets, removeDataset, setDatasetColor, handleAttributeChange, selectedAttributes }) {
  const [popupDataset, setPopupDataset] = useState(null);
  const [statsData, setStatsData] = useState({});
  const [attributes, setAttributes] = useState({});

  useEffect(() => {
    const fetchAttributes = async () => {
      const attributesObj = {};
      for (const dataset of datasets) {
        try {
          const response = await axios.get(`http://localhost:5000/datasets/attributes/${dataset}`);
          attributesObj[dataset] = response.data;
        } catch (error) {
          console.error(`Error fetching attributes for ${dataset}:`, error);
        }
      }
      setAttributes(attributesObj);
    };
    fetchAttributes();
  }, [datasets]);

  useEffect(() => {
    const fetchStats = async () => {
      if (Object.keys(selectedAttributes).length > 0) {
        try {
          const response = await axios.post('http://localhost:5000/datasets/chart-data', {
            datasets,
            xAxis: 'someXAxis', // Update with the actual xAxis
            yAxisAttributes: selectedAttributes
          });
          setStatsData(response.data.statsData);
        } catch (error) {
          console.error('Error fetching stats data:', error);
        }
      }
    };
    fetchStats();
  }, [datasets, selectedAttributes]);

  const handleRemove = async (fileName) => {
    await axios.delete(`http://localhost:5000/datasets/delete/${fileName}`);
    removeDataset(fileName);
  };

  const handleColorChange = (fileName, color) => {
    setDatasetColor(fileName, color);
  };

  const handleOpenPopup = (dataset) => {
    setPopupDataset(dataset);
  };

  const handleClosePopup = () => {
    setPopupDataset(null);
  };

  return (
    <>
      <ul>
        {datasets.map((dataset, index) => (
          <li key={`${dataset}-${index}`}>
            <span>{dataset}</span>
            <input
              type="color"
              onChange={(e) => handleColorChange(dataset, e.target.value)}
              defaultValue="#000000"
            />
            <button onClick={() => handleOpenPopup(dataset)}>View Data</button>
            <button onClick={() => handleRemove(dataset)}>Remove</button>
            {attributes[dataset] && (
              <select
                onChange={(e) => handleAttributeChange(dataset, e.target.value)}
                value={selectedAttributes[dataset] || ""}
              >
                <option value="" disabled>Select Attribute</option>
                {attributes[dataset].map(attr => (
                  <option key={attr} value={attr}>{attr}</option>
                ))}
              </select>
            )}
            {statsData[dataset] && (
              <StatsCard 
                min={statsData[dataset].min}
                max={statsData[dataset].max}
                mean={statsData[dataset].mean}
              />
            )}
          </li>
        ))}
      </ul>
      {popupDataset && (
        <Popup dataset={popupDataset} onClose={handleClosePopup} />
      )}
    </>
  );
}

export default DatasetList;
