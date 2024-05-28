import React from 'react';
import './StatsCard.css';

function StatsCard({ min, max, mean }) {
  return (
    <div className="stats-card">
      <div className="stats-item">
        <strong>Min:</strong> {min}
      </div>
      <div className="stats-item">
        <strong>Max:</strong> {max}
      </div>
      <div className="stats-item">
        <strong>Mean:</strong> {mean}
      </div>
    </div>
  );
}

export default StatsCard;
