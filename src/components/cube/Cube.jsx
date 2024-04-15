import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui"; // Import dat.gui
import { InteractionManager } from 'three.interactive';
import * as quatlib from "../../lib/QuaternionLibrary";
import { cube } from "mathjs";

const Cube = () => {
  const containerRef = useRef(null);
  const cubeRef = useRef(null); // Reference to the cube mesh
  const rotationStruct = useRef(null);

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

    // const orbConrols = new OrbitControls(camera, renderer.domElement);

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

    //Swipe rotation code
    const cubeRotationStruct={
      mouseDown : false,
      rotateStartPoint : new THREE.Vector3(0, 0, 1),
      rotateEndPoint : new THREE.Vector3(0, 0, 1),
      curQuaternion : new quatlib.RotationQuaternion(0,0,0,0),
      windowHalfX : window.innerWidth / 2,
      windowHalfY : window.innerHeight / 2,
      rotationSpeed : 1000,
      lastMoveTimestamp : new Date(),
      moveReleaseTimeDelta : 50,
      startPoint : {
        x: 0,
        y: 0
      },
      deltaX : 0,
      deltaY : 0
    }

    rotationStruct.current = cubeRotationStruct;

    function onWindowResize()
    {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
  
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
  
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  
    function onDocumentMouseDown(event)
    {
      //event.preventDefault();  
      cubeRef.current.addEventListener('mousemove', onDocumentMouseMove);
      cubeRef.current.addEventListener('mouseup', onDocumentMouseUp);
  
      rotationStruct.current.mouseDown = true;
  
      rotationStruct.current.startPoint = {
        x: event.coords.x,
        y: event.coords.y
      };
  
      rotationStruct.current.rotateStartPoint = rotationStruct.current.rotateEndPoint = projectOnTrackball(0, 0);
    }
  
    function onDocumentMouseMove(event)
    {
      rotationStruct.current.deltaX = event.coords.x - rotationStruct.current.startPoint.x;
      rotationStruct.current.deltaY = event.coords.y - rotationStruct.current.startPoint.y;
  
      handleRotation();
  
      rotationStruct.current.startPoint.x = event.coords.x;
      rotationStruct.current.startPoint.y = event.coords.y;
  
      rotationStruct.current.lastMoveTimestamp = new Date();
    }
  
    function onDocumentMouseUp(event)
    {
      if (new Date().getTime() - rotationStruct.current.lastMoveTimestamp.getTime() > rotationStruct.current.moveReleaseTimeDelta)
      {
        rotationStruct.current.deltaX = event.coords.x - rotationStruct.current.startPoint.x;
        rotationStruct.current.deltaY = event.coords.y - rotationStruct.current.startPoint.y;
      }
  
      rotationStruct.current.mouseDown = false;
  
      cubeRef.current.removeEventListener('mousemove', onDocumentMouseMove);
      cubeRef.current.removeEventListener('mouseup', onDocumentMouseUp);
    }
  
    function projectOnTrackball(touchX, touchY)
    {
      console.log(touchX,"/",touchY);
      var mouseOnBall = new THREE.Vector3();
  
      mouseOnBall.set(
        clamp(touchX / rotationStruct.current.windowHalfX, -1, 1), clamp(touchY / rotationStruct.current.windowHalfY, -1, 1),
        0.0
      );
  
      var length = mouseOnBall.length();
  
      if (length > 1.0)
      {
        mouseOnBall.normalize();
      }
      else
      {
        mouseOnBall.z = Math.sqrt(1.0 - length * length);
      }
  
      return mouseOnBall;
    }
  
    function rotateMatrix(rotateStart, rotateEnd)
    {
      var axis = new THREE.Vector3(), quaternion = new quatlib.RotationQuaternion(0,0,0,0);
  
      var angle = Math.acos(rotateStart.dot(rotateEnd) / rotateStart.length() / rotateEnd.length());
  
      if(angle)
      {
        axis.crossVectors(rotateStart, rotateEnd).normalize();
        angle *= rotationStruct.current.rotationSpeed;

        quaternion = new quatlib.RotationQuaternion(axis.x, axis.y, axis.z, angle);
      }
      // console.log("New quat:", quaternion);
      return quaternion;
    }
  
    function clamp(value, min, max)
    {
      return Math.min(Math.max(value, min), max);
    }

    var handleRotation = function()
    {
      rotationStruct.current.rotateEndPoint = projectOnTrackball(rotationStruct.current.deltaX, rotationStruct.current.deltaY);

      var rotateQuaternion = rotateMatrix(rotationStruct.current.rotateStartPoint, rotationStruct.current.rotateEndPoint);

      rotateQuaternion.ApplyToThreeObjectDirect(cubeRef.current);
      // rotationStruct.current.curQuaternion = quatlib.RotationQuaternion.ConstructQuaternionFromThree(cubeRef.current.quaternion);
      // rotationStruct.current.curQuaternion.PreMultiply(rotateQuaternion);
      // rotationStruct.current.curQuaternion = rotationStruct.current.curQuaternion.Normalized();
      // // cubeRef.current.setRotationFromQuaternion(rotationStruct.current.curQuaternion);
      // cubeRef.current.quaternion.copy(rotationStruct.current.curQuaternion);

      rotationStruct.current.rotateEndPoint = rotationStruct.current.rotateStartPoint;
    };

    const interactionManager = new InteractionManager(
      renderer,
      camera,
      renderer.domElement
    );

    interactionManager.add(cubeRef.current);
    cubeRef.current.addEventListener('mousedown', onDocumentMouseDown);

    const animate = () => {
      requestAnimationFrame(animate);
      interactionManager.update();

      // Update cube rotation
      // if(!rotationStruct.current.mouseDown)
      // {
      //   const quaternion = new THREE.Quaternion().setFromEuler(
      //     new THREE.Euler(
      //       THREE.MathUtils.degToRad(rotation.x),
      //       THREE.MathUtils.degToRad(rotation.y),
      //       THREE.MathUtils.degToRad(rotation.z),
      //       "XYZ"
      //     )
      //   );
      //   cubeRef.current.quaternion.copy(quaternion);
      // }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      // Cleanup function
      renderer.dispose();
      scene.remove(cubeRef.current);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          // Dispose of geometry and material
          obj.geometry.dispose();
          obj.material.dispose();
        }
      });

      gui.destroy();
    };
  }, []);

  return <div className="cube-container" ref={containerRef}></div>;
};

export default Cube;
