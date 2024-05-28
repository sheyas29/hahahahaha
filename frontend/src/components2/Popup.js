import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Popup.css';

function Popup({ dataset, onClose }) {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/datasets/${dataset}`);
        if (response.data.length > 0) {
          setHeaders(Object.keys(response.data[0]));
          setData(response.data);
        }
      } catch (error) {
        console.error('Error fetching dataset data:', error);
      }
    };
    fetchData();
  }, [dataset]);

  return (
    <div className="popup">
      <div className="popup-inner">
        <h3>{dataset} Data</h3>
        <button className="close-btn" onClick={onClose}>Close</button>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                {headers.map(header => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  {headers.map(header => (
                    <td key={header}>{row[header]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Popup;
