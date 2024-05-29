import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from './Popup';
import StatsCard from './StatsCard';

function DatasetList({ datasets, removeDataset, setDatasetColor, yAxis }) {
  const [popupDataset, setPopupDataset] = useState(null);
  const [statsData, setStatsData] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      if (datasets.length > 0 && yAxis) {
        try {
          const response = await axios.post('http://localhost:5000/datasets/chart-data', {
            datasets,
            xAxis: 'someXAxis', // Placeholder for xAxis, not used here
            yAxis
          });
          setStatsData(response.data.statsData);
        } catch (error) {
          console.error('Error fetching stats data:', error);
        }
      }
    };
    fetchStats();
  }, [datasets, yAxis]);

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
            {statsData[dataset] && (
              <StatsCard 
                min={statsData[dataset].min}
                max={statsData[dataset].max}
                mean={statsData[dataset].mean}
                variance={statsData[dataset].variance}
                stdev={statsData[dataset].stdev}
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
