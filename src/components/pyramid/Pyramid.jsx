import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui"; // Import dat.gui
import * as QuaternionLib from "../../lib/QuaternionLibrary";
import * as Convert from "../../lib/QuaternionConvert";

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

    let oldX = 0;
    let oldY = 0;
    let oldZ = 0;

    const animate = () => {
      requestAnimationFrame(animate);

      // Apply rotation for each axis

      const newX = rotation.x === oldX ? 0 : rotation.x - oldX;
      const newY = rotation.y === oldY ? 0 : rotation.y - oldY;
      const newZ = rotation.z === oldZ ? 0 : rotation.z - oldZ;

      oldX = rotation.x;
      oldY = rotation.y;
      oldZ = rotation.z;

      const {
        q_0: xQ0,
        q_1: xQ1,
        q_2: xQ2,
        q_3: xQ3,
      } = Convert.convertAxisToQuaternion(
        1,
        0,
        0,
        THREE.MathUtils.degToRad(newX)
      );

      const {
        q_0: yQ0,
        q_1: yQ1,
        q_2: yQ2,
        q_3: yQ3,
      } = Convert.convertAxisToQuaternion(
        0,
        1,
        0,
        THREE.MathUtils.degToRad(newY)
      );

      const {
        q_0: zQ0,
        q_1: zQ1,
        q_2: zQ2,
        q_3: zQ3,
      } = Convert.convertAxisToQuaternion(
        0,
        0,
        1,
        THREE.MathUtils.degToRad(newZ)
      );

      const quaternionX = new QuaternionLib.RotationQuaternion(1, 1, 1, 1);
      quaternionX.SetQ_0 = xQ0;
      quaternionX.SetQ_1 = xQ1;
      quaternionX.SetQ_2 = xQ2;
      quaternionX.SetQ_3 = xQ3;

      const quaternionY = new QuaternionLib.RotationQuaternion(1, 1, 1, 1);
      quaternionY.SetQ_0 = yQ0;
      quaternionY.SetQ_1 = yQ1;
      quaternionY.SetQ_2 = yQ2;
      quaternionY.SetQ_3 = yQ3;

      const quaternionZ = new QuaternionLib.RotationQuaternion(1, 1, 1, 1);
      quaternionZ.SetQ_0 = zQ0;
      quaternionZ.SetQ_1 = zQ1;
      quaternionZ.SetQ_2 = zQ2;
      quaternionZ.SetQ_3 = zQ3;

      //   //   const rotationQuaternion = quaternionX
      //   //     .PreMultiply(quaternionY)
      //   //     .PreMultiply(quaternionZ);

      //   //   console.log(quaternionX);
      quaternionX.ApplyToThreeObject(pyramidRef.current);

      quaternionY.ApplyToThreeObject(pyramidRef.current);

      quaternionZ.ApplyToThreeObject(pyramidRef.current);

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
