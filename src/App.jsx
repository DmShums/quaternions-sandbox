import React, { useState, useEffect } from "react";
import "./App.css";
import * as dat from "dat.gui"; // Import dat.gui

import ComponentSelector from "./components/Selector/ComponentSelector";
import RotationSelector from "./components/RotationSelector/RotationSelector";
import Cube from "./components/Cube/Cube";
import Pyramid from "./components/Pyramid/Pyramid";

import FileUpload from "./components/YourObject/FileUpload";
// import ObjectLoader from "./components/ObjectLoader/ObjectLoader";
import YourObject from "./components/YourObject/YourObject";

function App() {
  const [selectedComponent, setSelectedComponent] = useState(
    localStorage.getItem("selectedComponent") || "cube"
  );

  const [file, setFile] = useState(null); // State to store uploaded file
  const [rotation, setRotation] = useState(
    JSON.parse(localStorage.getItem("rotation")) || { x: 0, y: 0, z: 0 }
  ); // State for rotation

  const handleComponentChange = (event) => {
    const component = event.target.value;
    setSelectedComponent(component);
    localStorage.setItem("selectedComponent", component);
  };

  const handleRotationChange = (event) => {
    localStorage.setItem("selectedRotation", event.target.value);
  };

  const handleFileChange = (file) => {
    setFile(file);
  };

  useEffect(() => {
    localStorage.setItem("rotation", JSON.stringify(rotation));
  }, [rotation]);

  return (
    <>
      <ComponentSelector
        selectedComponent={selectedComponent}
        handleComponentChange={handleComponentChange}
      />

      <RotationSelector handleRotationChange={handleRotationChange} />

      {selectedComponent === "cube" ? (
        <Cube
          rotationX={rotation.x}
          rotationY={rotation.y}
          rotationZ={rotation.z}
          setRotation={setRotation}
        />
      ) : selectedComponent === "pyramid" ? (
        <Pyramid
          rotationX={rotation.x}
          rotationY={rotation.y}
          rotationZ={rotation.z}
          setRotation={setRotation}
        />
      ) : (
        <>
          <FileUpload onFileChange={handleFileChange} />
          {file && (
            <YourObject
              fileURL={URL.createObjectURL(file)}
              rotation={rotation}
              setRotation={setRotation}
            />
          )}
        </>
      )}
    </>
  );
}

export default App;
