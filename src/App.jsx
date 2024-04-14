import React, { useState } from 'react';
import './App.css';
import * as dat from 'dat.gui'; // Import dat.gui

import ComponentSelector from './components/Selector/ComponentSelector';
import Cube from './components/Cube/Cube';
import Pyramid from './components/Pyramid/Pyramid';

import FileUpload from './components/FileUpload/FileUpload';
import ObjectLoader from './components/ObjectLoader/ObjectLoader';
import YourObject from './components/YourObject/YourObject';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function App() {
  const [selectedComponent, setSelectedComponent] = useState('cube');
  const [file, setFile] = useState(null); // State to store uploaded file
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 }); // State for rotation

  const handleComponentChange = (event) => {
    setSelectedComponent(event.target.value);
  };

  const handleFileChange = (file) => {
    setFile(file);
  };

  return (
    <>
      <ComponentSelector selectedComponent={selectedComponent} handleComponentChange={handleComponentChange} />

      {selectedComponent === 'cube' ? (
        <Cube rotationX={rotation.x} rotationY={rotation.y} rotationZ={rotation.z} />
      ) : selectedComponent === 'pyramid' ? (
        <Pyramid rotationX={rotation.x} rotationY={rotation.y} rotationZ={rotation.z} />
      ) : (
        <>
          <FileUpload onFileChange={handleFileChange} />
          {file && <ObjectLoader fileURL={URL.createObjectURL(file)} rotation={rotation} />}
          {file && <YourObject fileURL={URL.createObjectURL(file)} rotation={rotation} />}
        </>
      )}
    </>
  );
}

export default App;
