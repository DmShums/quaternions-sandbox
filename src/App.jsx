import React, { useState, useEffect } from 'react';
import './App.css';
import * as dat from 'dat.gui'; // Import dat.gui

import ComponentSelector from './components/selector/ComponentSelector';
import Cube from './components/cube/Cube';
import Pyramid from './components/pyramid/Pyramid';

function App() {
  const [selectedComponent, setSelectedComponent] = useState('cube');
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 }); // State for cube rotation

  const handleComponentChange = (event) => {
    setSelectedComponent(event.target.value);
  };

  // Initialize dat.gui controls
  // useEffect(() => {
  //   const gui = new dat.GUI(); // Create dat.gui instance

  //   // Add controls for cube rotation
  //   const cubeRotationFolder = gui.addFolder('Cube Rotation');
  //   cubeRotationFolder.add(rotation, 'x', 0, 360).name('Rotation X');
  //   cubeRotationFolder.add(rotation, 'y', 0, 360).name('Rotation Y');
  //   cubeRotationFolder.add(rotation, 'z', 0, 360).name('Rotation Z');

  //   // Destroy dat.gui instance when component unmounts
  //   return () => {
  //     gui.destroy();
  //   };
  // }, []);

  return (
    <>
      <ComponentSelector selectedComponent={selectedComponent} handleComponentChange={handleComponentChange} />

      {selectedComponent === 'cube' ? (
        <Cube rotationX={rotation.x} rotationY={rotation.y} rotationZ={rotation.z} />
      ) : (
        <Pyramid rotationX={rotation.x} rotationY={rotation.y} rotationZ={rotation.z} />
      )}
    </>
  );
}

export default App;
