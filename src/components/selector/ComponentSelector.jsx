import React from 'react';
import './ComponentSelector.css';

const ComponentSelector = ({ selectedComponent, handleComponentChange }) => {
  return (
    <>
        <select className="selector" value={selectedComponent} onChange={handleComponentChange}>
        <option value="cube">Cube</option>
        <option value="triangle">Triangle</option>
        </select>
    </>
    
  );
};

export default ComponentSelector;
