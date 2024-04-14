import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui"; // Import dat.gui

const Cube = () => {
  const containerRef = useRef(null);
  const cubeRef = useRef(null); // Reference to the cube mesh

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#242424");

    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 10;

    const axesHelper = new THREE.AxesHelper(15);
    scene.add(axesHelper);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);

    containerRef.current.appendChild(renderer.domElement);

    new OrbitControls(camera, renderer.domElement);

    // Create or update the cube mesh
    if (!cubeRef.current) {
      const geometry = new THREE.BoxGeometry(3, 3, 3);
      const material = new THREE.MeshPhongMaterial({ color: 0x0000ff }); // Change color to blue
      const cubeMesh = new THREE.Mesh(geometry, material);
      scene.add(cubeMesh);

      cubeRef.current = cubeMesh; // Store a reference to the cube mesh
    }

    cubeRef.current.position.x += 1;
    cubeRef.current.position.y += 1;
    cubeRef.current.position.z += 1;
    // Add lights to the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    // Setup dat.gui for controlling cube rotation
    const gui = new dat.GUI();
    const rotation = { x: 0, y: 0, z: 0 };
    const cubeRotationFolder = gui.addFolder("Cube Rotation");
    cubeRotationFolder.add(rotation, "x", 0, 360).name("Rotation X");
    cubeRotationFolder.add(rotation, "y", 0, 360).name("Rotation Y");
    cubeRotationFolder.add(rotation, "z", 0, 360).name("Rotation Z");

    const animate = () => {
      requestAnimationFrame(animate);

      // Update cube rotation
      const quaternion = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          THREE.MathUtils.degToRad(rotation.x),
          THREE.MathUtils.degToRad(rotation.y),
          THREE.MathUtils.degToRad(rotation.z),
          "XYZ"
        )
      );
      cubeRef.current.quaternion.copy(quaternion);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      // Cleanup function
      renderer.dispose();
      scene.remove(cubeRef.current); // Remove the cube mesh from the scene

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          // Dispose of geometry and material
          obj.geometry.dispose();
          obj.material.dispose();
        }
      });

      gui.destroy(); // Destroy dat.gui instance
    };
  }, []);

  return <div className="cube-container" ref={containerRef}></div>;
};

export default Cube;
