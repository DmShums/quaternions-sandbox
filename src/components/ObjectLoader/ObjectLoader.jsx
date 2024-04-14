import React, { useEffect, useRef } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ObjectLoader = ({ fileURL, scene }) => {
  const objectRef = useRef(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      fileURL,
      (gltf) => {
        // Assuming the first object in the gltf scene is the one we want
        const object = gltf.scene.children[0];
        objectRef.current = object;
        scene.add(object);
      },
      undefined,
      (error) => {
        console.error('Error loading 3D object:', error);
      }
    );
  }, [fileURL, scene]);

  return null;
};

export default ObjectLoader;
