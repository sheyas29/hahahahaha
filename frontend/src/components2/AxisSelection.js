import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AxisSelection({ setXAxis, setYAxis, datasets }) {
  const [attributes, setAttributes] = useState([]);

  useEffect(() => {
    const fetchAttributes = async () => {
      if (datasets.length > 0) {
        try {
          const response = await axios.get(`http://localhost:5000/datasets/attributes/${datasets[0]}`);
          setAttributes(response.data);
        } catch (error) {
          console.error('Error fetching attributes:', error);
        }
      }
    };
    fetchAttributes();
  }, [datasets]);

  return (
    <div>
      <div className="flex-item">
        <label className="label" htmlFor="x-axis">Select X-Axis Attribute:</label>
        <select id="x-axis" onChange={(e) => setXAxis(e.target.value)} defaultValue="">
          <option value="" disabled>Select X-Axis</option>
          {attributes.map(attr => (
            <option key={attr} value={attr}>{attr}</option>
          ))}
        </select>
      </div>
      <div className="flex-item">
        <label className="label" htmlFor="y-axis">Select Y-Axis Attribute:</label>
        <select id="y-axis" onChange={(e) => setYAxis(e.target.value)} defaultValue="">
          <option value="" disabled>Select Y-Axis</option>
          {attributes.map(attr => (
            <option key={attr} value={attr}>{attr}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default AxisSelection;
