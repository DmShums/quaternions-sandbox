import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import * as QuaternionLib from '../../lib/QuaternionLibrary';
import * as Convert from '../../lib/QuaternionConvert';
import * as EulerLib from '../../lib/EulerAnglesLibrary';
import './YourObject.css';

const YourObject = ({ fileURL }) => {
  const containerRef = useRef(null);
  const objectRef = useRef(null);
  const scene = useRef(new THREE.Scene()).current;
  const guiRef = useRef(null);

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    scene.clear();
    scene.background = new THREE.Color('#242424');

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

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        // Setup dat.gui for controlling object rotation
        const gui = new dat.GUI();
        guiRef.current = gui;

        const rotation = { x: 0, y: 0, z: 0 };
        const objectRotationFolder = gui.addFolder('Object Rotation');
        objectRotationFolder.add(rotation, 'x', 0, 360).name('Rotation X');
        objectRotationFolder.add(rotation, 'y', 0, 360).name('Rotation Y');
        objectRotationFolder.add(rotation, 'z', 0, 360).name('Rotation Z');

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
          } = Convert.convertAxisToQuaternion(1, 0, 0, THREE.MathUtils.degToRad(newX));

          const {
            q_0: yQ0,
            q_1: yQ1,
            q_2: yQ2,
            q_3: yQ3,
          } = Convert.convertAxisToQuaternion(0, 1, 0, THREE.MathUtils.degToRad(newY));

          const {
            q_0: zQ0,
            q_1: zQ1,
            q_2: zQ2,
            q_3: zQ3,
          } = Convert.convertAxisToQuaternion(0, 0, 1, THREE.MathUtils.degToRad(newZ));

          const quaternionX = createQuaternion(xQ0, xQ1, xQ2, xQ3);
          const quaternionY = createQuaternion(yQ0, yQ1, yQ2, yQ3);
          const quaternionZ = createQuaternion(zQ0, zQ1, zQ2, zQ3);

          const rotationQuaternion = quaternionX
            .PostMultiplyThisAsFirst(quaternionY)
            .PostMultiplyThisAsFirst(quaternionZ);

          rotationQuaternion.ApplyToThreeObjectDirect(objectRef.current);
        }

        function rotateWithEuler() {
          oldX = rotation.x;
          oldY = rotation.y;
          oldZ = rotation.z;

          const newEuler = new EulerLib.Euler(
            THREE.MathUtils.degToRad(rotation.x),
            THREE.MathUtils.degToRad(rotation.y),
            THREE.MathUtils.degToRad(rotation.z),
            'XZY'
          );
          newEuler.applyRotationToObject(objectRef.current);
        }

        const animate = () => {
          requestAnimationFrame(animate);

          // Apply rotation for each axis
          let typeOfRotation = localStorage.getItem('selectedRotation');
          if (typeOfRotation == 'quaternion') {
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
      },
      undefined,
      (error) => {
        console.error('Error loading 3D object:', error);
      }
    );
  }, [fileURL, scene]);

  return <div className="object-container" ref={containerRef}></div>;
};

export default YourObject;
