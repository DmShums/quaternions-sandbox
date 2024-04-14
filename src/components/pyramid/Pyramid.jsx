import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui"; // Import dat.gui
import { RotationQuaternion } from "../../lib/QuaternionLibrary";

const Pyramid = ({ rotationX, rotationY, rotationZ }) => {
  const containerRef = useRef(null);
  const pyramidRef = useRef(null); // Reference to the pyramid mesh
  const guiRef = useRef(null); // Reference to dat.GUI instance

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#242424");

    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);

    const axesHelper = new THREE.AxesHelper(15);
    scene.add(axesHelper);

    containerRef.current.appendChild(renderer.domElement);

    new OrbitControls(camera, renderer.domElement);

    const radius = 3;
    const height = 3;

    const geometry = new THREE.CylinderGeometry(0, radius, height, 4, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const pyramidMesh = new THREE.Mesh(geometry, material);
    pyramidMesh.position.x += 1;
    pyramidMesh.position.y += 1;
    pyramidMesh.position.z += 1;

    scene.add(pyramidMesh);

    pyramidRef.current = pyramidMesh; // Store a reference to the pyramid mesh

    const light = new THREE.HemisphereLight("#FFFFFF", "#757575", 1.7);
    scene.add(light);

    // Setup dat.GUI for controlling pyramid rotation
    const gui = new dat.GUI();
    guiRef.current = gui;

    const rotation = { x: rotationX, y: rotationY, z: rotationZ };
    const pyramidRotationFolder = gui.addFolder("Pyramid Rotation");
    pyramidRotationFolder.add(rotation, "x", 0, 360).name("Rotation X");
    pyramidRotationFolder.add(rotation, "y", 0, 360).name("Rotation Y");
    pyramidRotationFolder.add(rotation, "z", 0, 360).name("Rotation Z");

    const animate = () => {
      requestAnimationFrame(animate);

      // Apply rotation for each axis
      const quaternionRotationX = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(1, 0, 0),
        THREE.MathUtils.degToRad(rotation.x)
      );
      const quaternionRotationY = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        THREE.MathUtils.degToRad(rotation.y)
      );
      const quaternionRotationZ = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 0, 1),
        THREE.MathUtils.degToRad(rotation.z)
      );

      const finalQuaternion = quaternionRotationX
        .multiply(quaternionRotationY)
        .multiply(quaternionRotationZ);

      pyramidRef.current.setRotationFromQuaternion(finalQuaternion);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      // Cleanup function
      renderer.dispose();

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          // Dispose of geometry and material
          obj.geometry.dispose();
          obj.material.dispose();
        }
      });

      // Destroy dat.GUI instance
      gui.destroy();
    };
  }, [rotationX, rotationY, rotationZ]);

  return <div className="pyramid-container" ref={containerRef}></div>;
};

export default Pyramid;
