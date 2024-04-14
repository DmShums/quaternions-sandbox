import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const YourObject = ({ fileURL, rotation }) => {
  const containerRef = useRef(null);
  const objectRef = useRef(null);

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#ffffff'); // Set background color

    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);

    containerRef.current.appendChild(renderer.domElement);

    // Load your 3D object here using fileURL
    // Example code for loading a GLTF model
    const loader = new THREE.GLTFLoader();
    loader.load(
      fileURL,
      (gltf) => {
        const object = gltf.scene;
        objectRef.current = object;
        scene.add(object);
      },
      undefined,
      (error) => {
        console.error('Error loading 3D object:', error);
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);

      // Update object rotation
      if (objectRef.current) {
        objectRef.current.rotation.x += THREE.MathUtils.degToRad(rotation.x);
        objectRef.current.rotation.y += THREE.MathUtils.degToRad(rotation.y);
        objectRef.current.rotation.z += THREE.MathUtils.degToRad(rotation.z);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      // Cleanup function
      renderer.dispose();
      scene.remove(objectRef.current); // Remove the object from the scene
    };
  }, [fileURL, rotation]);

  return <div className="object-container" ref={containerRef}></div>;
};

export default YourObject;
