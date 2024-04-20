import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui"; // Import dat.gui
import * as QuaternionLib from "../../lib/QuaternionLibrary";
import * as Convert from "../../lib/QuaternionConvert";
import * as EulerLib from "../../lib/EulerAnglesLibrary";

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

    const gridHelper = new THREE.GridHelper(100, 10);
    scene.add(gridHelper);

    containerRef.current.appendChild(renderer.domElement);

    new OrbitControls(camera, renderer.domElement);

    const radius = 3;
    const height = 3;

    const geometry = new THREE.CylinderGeometry(0, radius, height, 4, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const pyramidMesh = new THREE.Mesh(geometry, material);
    pyramidMesh.position.y += 2;

    pyramidRef.current = pyramidMesh;

    scene.add(pyramidMesh);

    const light = new THREE.HemisphereLight("#FFFFFF", "#757575", 1.7);
    scene.add(light);

    // Setup dat.GUI for controlling pyramid rotation
    const gui = new dat.GUI();
    guiRef.current = gui;

    const rotationObj = { x: rotationX, y: rotationY, z: rotationZ };
    const pyramidRotationFolder = gui.addFolder("Pyramid Rotation");
    pyramidRotationFolder.add(rotationObj, "x", 0, 360).name("Rotation X");
    pyramidRotationFolder.add(rotationObj, "y", 0, 360).name("Rotation Y");
    pyramidRotationFolder.add(rotationObj, "z", 0, 360).name("Rotation Z");

    let oldX = 0;
    let oldY = 0;
    let oldZ = 0;

    function createQuaternion(xQ0, xQ1, xQ2, xQ3) {
      const quaternion = new QuaternionLib.RotationQuaternion(1, 1, 1, 1);
      quaternion.SetQ_0(xQ0);
      quaternion.SetQ_1(xQ1);
      quaternion.SetQ_2(xQ2);
      quaternion.SetQ_3(xQ3);
      return quaternion;
    }

    function rotateWithQuaternion() {
      const newX = rotationObj.x === oldX ? 0 : rotationObj.x - oldX;
      const newY = rotationObj.y === oldY ? 0 : rotationObj.y - oldY;
      const newZ = rotationObj.z === oldZ ? 0 : rotationObj.z - oldZ;

      oldX = rotationObj.x;
      oldY = rotationObj.y;
      oldZ = rotationObj.z;

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

      const quaternionX = createQuaternion(xQ0, xQ1, xQ2, xQ3);
      const quaternionY = createQuaternion(yQ0, yQ1, yQ2, yQ3);
      const quaternionZ = createQuaternion(zQ0, zQ1, zQ2, zQ3);

      const rotationQuaternion = quaternionX
        .PostMultiplyThisAsFirst(quaternionY)
        .PostMultiplyThisAsFirst(quaternionZ);

      rotationQuaternion.ApplyToThreeObjectDirect(pyramidRef.current);
    }

    function rotateWithEuler() {
      oldX = rotationObj.x;
      oldY = rotationObj.y;
      oldZ = rotationObj.z;

      const newEuler = new EulerLib.Euler(
        THREE.MathUtils.degToRad(rotationObj.x),
        THREE.MathUtils.degToRad(rotationObj.y),
        THREE.MathUtils.degToRad(rotationObj.z),
        "XZY"
      );
      newEuler.applyRotationToObject(pyramidRef.current);
    }

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let axesVisible = false;

    renderer.domElement.addEventListener("dblclick", onClick);

    function onClick(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects([pyramidRef.current], true);

      if (intersects.length > 0) {
        if (!axesVisible) {
          const cubeAxesHelper = new THREE.AxesHelper(3);
          pyramidRef.current.add(cubeAxesHelper);
          axesVisible = true;
        } else {
          pyramidRef.current.remove(
            pyramidRef.current.children.find(
              (child) => child instanceof THREE.AxesHelper
            )
          );
          axesVisible = false;
        }
      }
    }

    const animate = () => {
      requestAnimationFrame(animate);

      // Apply rotation for each axis
      let typeOfRotation = localStorage.getItem("selectedRotation");
      if (typeOfRotation == "quaternion") {
        rotateWithQuaternion();
      } else {
        rotateWithEuler();
      }

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
