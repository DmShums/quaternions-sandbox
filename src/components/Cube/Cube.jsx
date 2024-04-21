import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import * as QuaternionLib from "../../lib/QuaternionLibrary";
import { RotateChildren, RotateChildrenEuler } from "../../lib/RotationLogic";
import * as Convert from "../../lib/QuaternionConvert";
import * as EulerLib from "../../lib/EulerAnglesLibrary";
import { InteractionManager } from "three.interactive";
import { cube } from "mathjs";

const Cube = () => {
  const containerRef = useRef(null);
  const cubeRef = useRef(null);
  const childrenMeshes = useRef(null);
  const childrenNormalizedPosition = useRef(null);
  const rotationStruct = useRef(null);

  function AddCubeMesh(position, rotation) {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({ color: 0xaeb09f });
    const cubeMesh = new THREE.Mesh(geometry, material);
    cubeMesh.position.set(position.x, position.y, position.z);
    cubeMesh.rotation.set(rotation.x, rotation.y, rotation.y);

    const initNormPosition = cubeMesh.position;
    initNormPosition.sub(cubeRef.current.position);

    childrenMeshes.current.push(cubeMesh);
    childrenNormalizedPosition.current.push([
      Convert.convertEulerToMatrix(new EulerLib.Euler(0, 0, 0)),
      new QuaternionLib.Vector3(
        initNormPosition.x,
        initNormPosition.y,
        initNormPosition.z
      ),
    ]);
    return cubeMesh;
  }

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#242424");

    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.rotation.copy(new THREE.Euler(-45, 45, 0, "YZX"));
    camera.position.set(10, 10, 10);

    const gridHelper = new THREE.GridHelper(100, 10);
    scene.add(gridHelper);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);

    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enablePan = false;
    orbit.minDistance = 20;
    orbit.maxDistance = 50;

    containerRef.current.appendChild(renderer.domElement);

    // Create or update the cube mesh
    if (!cubeRef.current) {
      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.MeshPhongMaterial({ color: 0x0000ff }); // Change color to blue
      const cubeMesh = new THREE.Mesh(geometry, material);

      cubeMesh.position.set(3, 8, 3);
      scene.add(cubeMesh);

      cubeRef.current = cubeMesh; // Store a reference to the cube mesh
    }

    // Add lights to the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    // Setup dat.gui for controlling cube rotation
    const gui = new dat.GUI();
    const rotationObj = { x: 0, y: 0, z: 0 };
    const cubeRotationFolder = gui.addFolder("Cube Rotation");
    cubeRotationFolder.add(rotationObj, "x", 0, 360).name("Rotation X");
    cubeRotationFolder.add(rotationObj, "y", 0, 360).name("Rotation Y");
    cubeRotationFolder.add(rotationObj, "z", 0, 360).name("Rotation Z");

    let oldX = 0;
    let oldY = 0;
    let oldZ = 0;
    //Test cube creation
    childrenMeshes.current = [];
    childrenNormalizedPosition.current = [];

    scene.add(AddCubeMesh({ x: 3, y: 7, z: 3 }, { x: -5, y: 0, z: 0 }));
    scene.add(AddCubeMesh({ x: 4, y: 5, z: 4 }, { x: 0, y: 0, z: 10 }));

    scene.add(AddCubeMesh({ x: -4, y: 5, z: -4 }, { x: 15, y: 0, z: 0 }));
    scene.add(AddCubeMesh({ x: -3, y: 3, z: -3 }, { x: 0, y: 20, z: 0 }));

    //Swipe rotation code
    const cubeRotationStruct = {
      mouseDown: false,
      rotateStartPoint: new THREE.Vector3(0, 0, 1),
      rotateEndPoint: new THREE.Vector3(0, 0, 1),
      curQuaternion: new QuaternionLib.RotationQuaternion(0, 0, 0, 0),
      windowHalfX: window.innerWidth / 2,
      windowHalfY: window.innerHeight / 2,
      rotationSpeed: 1000,
      lastMoveTimestamp: new Date(),
      moveReleaseTimeDelta: 50,
      startPoint: {
        x: 0,
        y: 0,
      },
      deltaX: 0,
      deltaY: 0,
    };

    rotationStruct.current = cubeRotationStruct;

    function onDocumentMouseDown(event) {
      orbit.enableRotate = false;
      cubeRef.current.addEventListener("mousemove", onDocumentMouseMove);
      cubeRef.current.addEventListener("mouseup", onDocumentMouseUp);

      rotationStruct.current.mouseDown = true;

      rotationStruct.current.startPoint = {
        x: event.coords.x,
        y: event.coords.y,
      };

      rotationStruct.current.rotateStartPoint =
        rotationStruct.current.rotateEndPoint = projectOnTrackball(0, 0);
    }

    function onDocumentMouseMove(event) {
      rotationStruct.current.deltaX =
        event.coords.x - rotationStruct.current.startPoint.x;
      rotationStruct.current.deltaY =
        event.coords.y - rotationStruct.current.startPoint.y;

      handleRotation();

      rotationStruct.current.startPoint.x = event.coords.x;
      rotationStruct.current.startPoint.y = event.coords.y;

      rotationStruct.current.lastMoveTimestamp = new Date();
    }

    function onDocumentMouseUp(event) {
      orbit.enableRotate = true;
      if (
        new Date().getTime() -
          rotationStruct.current.lastMoveTimestamp.getTime() >
        rotationStruct.current.moveReleaseTimeDelta
      ) {
        rotationStruct.current.deltaX =
          event.coords.x - rotationStruct.current.startPoint.x;
        rotationStruct.current.deltaY =
          event.coords.y - rotationStruct.current.startPoint.y;
      }

      rotationStruct.current.mouseDown = false;

      cubeRef.current.removeEventListener("mousemove", onDocumentMouseMove);
      cubeRef.current.removeEventListener("mouseup", onDocumentMouseUp);
    }

    function projectOnTrackball(touchX, touchY) {
      var mouseOnBall = new THREE.Vector3();

      mouseOnBall.set(
        clamp(touchX / rotationStruct.current.windowHalfX, -1, 1),
        clamp(touchY / rotationStruct.current.windowHalfY, -1, 1),
        0.0
      );

      var length = mouseOnBall.length();

      if (length > 1.0) {
        mouseOnBall.normalize();
      } else {
        mouseOnBall.z = Math.sqrt(1.0 - length * length);
      }

      return mouseOnBall;
    }

    function rotateMatrix(rotateStart, rotateEnd) {
      var axis = new THREE.Vector3(),
        quaternion = new QuaternionLib.RotationQuaternion(0, 0, 0, 0);

      var angle = Math.acos(
        rotateStart.dot(rotateEnd) / rotateStart.length() / rotateEnd.length()
      );

      if (angle) {
        axis.crossVectors(rotateStart, rotateEnd).normalize();
        angle *= rotationStruct.current.rotationSpeed;

        quaternion = new QuaternionLib.RotationQuaternion(
          axis.x,
          axis.y,
          axis.z,
          angle
        );
      }
      return quaternion;
    }

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    var handleRotation = function () {
      rotationStruct.current.rotateEndPoint = projectOnTrackball(
        rotationStruct.current.deltaX,
        rotationStruct.current.deltaY
      );

      var rotateQuaternion = rotateMatrix(
        rotationStruct.current.rotateStartPoint,
        rotationStruct.current.rotateEndPoint
      );

      rotateQuaternion = rotateQuaternion.Normalized();
      const eulerOfRotationQ =
        Convert.convertQuaternionToEuler(rotateQuaternion);
      let newX = (rotationObj.x + eulerOfRotationQ.roll) % 360;
      let newY = (rotationObj.y + eulerOfRotationQ.pitch) % 360;
      let newZ = (rotationObj.z + eulerOfRotationQ.yaw) % 360;

      if (newX < 0) newX += 360;
      if (newY < 0) newY += 360;
      if (newZ < 0) newZ += 360;

      rotationObj.x = newX;
      rotationObj.y = newY;
      rotationObj.z = newZ;

      oldX = rotationObj.x;
      oldY = rotationObj.y;
      oldZ = rotationObj.z;

      cubeRotationFolder.updateDisplay();

      rotateQuaternion.ApplyToThreeObjectDirect(cubeRef.current);
      RotateChildren(childrenMeshes.current, rotateQuaternion, cubeRef.current);

      rotationStruct.current.rotateEndPoint =
        rotationStruct.current.rotateStartPoint;
    };

    const interactionManager = new InteractionManager(
      renderer,
      camera,
      renderer.domElement
    );

    interactionManager.add(cubeRef.current);
    cubeRef.current.addEventListener("mousedown", onDocumentMouseDown);
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let axesVisible = false;

    renderer.domElement.addEventListener("dblclick", onClick);

    function onClick(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects([cubeRef.current], true);

      if (intersects.length > 0) {
        if (!axesVisible) {
          const cubeAxesHelper = new THREE.AxesHelper(3);
          cubeRef.current.add(cubeAxesHelper);
          axesVisible = true;
        } else {
          cubeRef.current.remove(
            cubeRef.current.children.find(
              (child) => child instanceof THREE.AxesHelper
            )
          );
          axesVisible = false;
        }
      }
    }

    function rotateWithQuaternion(euler) {
      const { q0, q1, q2, q3 } = Convert.convertEulerToQuaternion(euler);

      const rotationQuaternion =
        QuaternionLib.RotationQuaternion.ConstructQuaternionFromAxes(
          q0,
          q1,
          q2,
          q3
        );

      rotationQuaternion.ApplyToThreeObjectDirect(cubeRef.current);
      RotateChildren(
        childrenMeshes.current,
        rotationQuaternion,
        cubeRef.current
      );
    }

    function rotateWithEuler(euler) {
      EulerLib.ApplyStandartizedOrderRotationIntrinsic(cubeRef.current, euler);
      RotateChildrenEuler(
        childrenMeshes.current,
        childrenNormalizedPosition.current,
        euler,
        cubeRef.current
      );
    }

    const animate = () => {
      requestAnimationFrame(animate);
      interactionManager.update();

      const newX = rotationObj.x === oldX ? 0 : rotationObj.x - oldX;
      const newY = rotationObj.y === oldY ? 0 : rotationObj.y - oldY;
      const newZ = rotationObj.z === oldZ ? 0 : rotationObj.z - oldZ;

      oldX = rotationObj.x;
      oldY = rotationObj.y;
      oldZ = rotationObj.z;

      const euler = new EulerLib.Euler(newX, newY, newZ);
      /////////////////////////////////////////////
      let typeOfRotation = localStorage.getItem("selectedRotation");
      if (newX != 0 || newY != 0 || newZ != 0) {
        if (typeOfRotation == "quaternion") {
          rotateWithQuaternion(euler);
        } else {
          rotateWithEuler(euler);
        }
      }
      /////////////////////////////////////////////
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
