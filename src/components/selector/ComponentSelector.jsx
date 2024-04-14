import React from 'react';
import './ComponentSelector.css';

const ComponentSelector = ({ selectedComponent, handleComponentChange }) => {
  return (
    <>
        <select className="selector" value={selectedComponent} onChange={handleComponentChange}>
        <option value="cube">Cube</option>
        <option value="pyramid">Pyramid</option>
        <option value="object">Your object</option>
        </select>
    </>
  );
};

export default ComponentSelector;
