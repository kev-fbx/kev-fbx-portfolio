"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ThreeScene() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvasContainer = canvasRef.current;
    if (!canvasContainer) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasContainer.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load("/assets/textures/world.png");
    const material = new THREE.MeshBasicMaterial({ map: earthTexture });

    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.y = -2;
    sphere.rotation.x = 0.8;
    scene.add(sphere);

    camera.position.z = 1.1;
    camera.position.y = -0.9;

    const animate = () => {
      requestAnimationFrame(animate);
      sphere.rotation.y += 0.0005;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvasContainer.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1 }} />;
}
