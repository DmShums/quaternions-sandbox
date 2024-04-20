import React from "react";
import { Link } from "react-router-dom";
import "./RotationSelector.css";

const RotationSelector = ({ selectedRotation, handleRotationChange }) => {
  return (
    <select
      className="rotation-selector"
      value={selectedRotation}
      onChange={handleRotationChange}
    >
      <option value="quaternion">Quaternion</option>
      <option value="euler">Euler</option>
    </select>
  );
};

export default RotationSelector;
