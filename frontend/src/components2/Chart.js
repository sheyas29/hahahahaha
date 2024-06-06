import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import axios from 'axios';
import Spinner from './Spinner';
import ErrorModal from './ErrorModal';
import './ChartComponent.css';

Chart.register(...registerables, zoomPlugin);

function ChartComponent({ datasets, xAxis, yAxis, referenceDataset, datasetColors, xMin, xMax, yMin, yMax }) {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({});
  const [combinedXValues, setCombinedXValues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (datasets.length > 0 && xAxis && yAxis) {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.post('http://localhost:5000/datasets/chart-data', {
            datasets,
            xAxis,
            yAxis
          });
          setChartData(response.data.chartData);
          setCombinedXValues(response.data.combinedXValues);
        } catch (error) {
          setError('Error fetching chart data');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [datasets, xAxis, yAxis]);

  const data = {
    labels: combinedXValues,
    datasets: datasets.map(dataset => ({
      label: dataset,
      data: combinedXValues.map(xValue => {
        const found = chartData[dataset]?.find(item => item.x === xValue);
        return found ? found.y : null;
      }),
      fill: false,
      borderColor: dataset === referenceDataset ? 'red' : (datasetColors[dataset] || '#000000'),
      borderWidth: 2
    }))
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        min: xMin !== null ? xMin : undefined,
        max: xMax !== null ? xMax : undefined,
      },
      y: {
        type: 'linear',
        min: yMin !== null ? yMin : undefined,
        max: yMax !== null ? yMax : undefined,
      },
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy',
        },
        zoom: {
          wheel: {
            enabled: true, // Enable zooming with the mouse wheel
          },
          pinch: {
            enabled: true, // Enable zooming with pinch gestures
          },
          drag: {
            enabled: false, // Disable zooming with drag gestures
          }
        },
      },
      decimation: {
        enabled: true,
        algorithm: 'lttb',
        samples: 100,
      },
    },
    elements: {
      point: {
        radius: 1,
      },
      line: {
        tension: 0.4,
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <div className="chart-container">
      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorModal error={error} onClose={handleCloseError} />
      ) : (
        <Line ref={chartRef} data={data} options={options} />
      )}
    </div>
  );
}

export default ChartComponent;
