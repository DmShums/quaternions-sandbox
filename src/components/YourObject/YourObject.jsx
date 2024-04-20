import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import './YourObject.css';

const YourObject = ({ fileURL }) => {
  const containerRef = useRef(null);
  const objectRef = useRef(null);
  const scene = useRef(new THREE.Scene()).current;

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    scene.clear();
    scene.background = new THREE.Color("#242424");

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 60;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);
    containerRef.current.appendChild(renderer.domElement);

    const loader = new GLTFLoader();
    loader.load(
      fileURL,
      (gltf) => {
        const object = gltf.scene;
        objectRef.current = object;
        scene.add(object);

        const box = new THREE.Box3().setFromObject(object);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);
        const yOffset = -size.y / 2;
        const gridPosition = new THREE.Vector3(center.x, center.y + yOffset, center.z);

        const gridHelper = new THREE.GridHelper(100, 10);
        gridHelper.position.copy(gridPosition);
        scene.add(gridHelper);
      },
      undefined,
      (error) => {
        console.error('Error loading 3D object:', error);
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);
      if (objectRef.current) {
        objectRef.current.rotation.z += 0.1
        objectRef.current.rotation.y += 0.01;
      }
      renderer.render(scene, camera);
    };

    animate();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Setup dat.gui for controlling cube rotation
    const gui = new dat.GUI();
    const rotation = { x: 0, y: 0, z: 0 };
    const cubeRotationFolder = gui.addFolder("Object Rotation");
    cubeRotationFolder.add(rotation, "x", 0, 360).name("Rotation X");
    cubeRotationFolder.add(rotation, "y", 0, 360).name("Rotation Y");
    cubeRotationFolder.add(rotation, "z", 0, 360).name("Rotation Z");

    return () => {
      renderer.dispose();
      controls.dispose();
      gui.destroy();
    };
  }, [fileURL, scene]);

  return <div className="object-container" ref={containerRef}></div>;
};

export default YourObject;
