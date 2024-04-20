import React from 'react';
import { Link } from 'react-router-dom';
import './ComponentSelector.css'

const ComponentSelector = ({ selectedComponent, handleComponentChange }) => {
  return (
      <select className="selector" value={selectedComponent} onChange={handleComponentChange}>
        <option value="cube">Cube</option>
        <option value="pyramid">Pyramid</option>
        <option value="object">Object</option>
      </select>
  );
};

export default ComponentSelector;
