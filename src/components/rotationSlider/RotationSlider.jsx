import React from 'react';
import './RotationSlider.css';

const RotationSlider = ({ x, y, z, onChange }) => {
  const handleXChange = (event) => {
    onChange('x', parseFloat(event.target.value));
  };

  const handleYChange = (event) => {
    onChange('y', parseFloat(event.target.value));
  };

  const handleZChange = (event) => {
    onChange('z', parseFloat(event.target.value));
  };

  return (
    <div className="RotationSlider">
      <label>X:</label>
      <input type="range" min="0" max="360" value={x} onChange={handleXChange} /><br />
      <label>Y:</label>
      <input type="range" min="0" max="360" value={y} onChange={handleYChange} /><br />
      <label>Z:</label>
      <input type="range" min="0" max="360" value={z} onChange={handleZChange} />
    </div>
  );
};

export default RotationSlider;
