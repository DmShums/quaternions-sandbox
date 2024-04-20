import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './YourObject.css';

const NoObjectPreview = () => {
    const containerRef = useRef(null);
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

        const gridHelper = new THREE.GridHelper(100, 10);
        gridHelper.position.set(0, -10, 0);
        scene.add(gridHelper);

        const animate = () => {
            requestAnimationFrame(animate);

            renderer.render(scene, camera);
        };

        animate();

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        return () => {
            renderer.dispose();
            controls.dispose();
        };
    }, []);

    return <div className="object-container" ref={containerRef}></div>;
}

export default NoObjectPreview;
