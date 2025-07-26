import * as THREE from 'three';
import { gsap } from 'https://cdn.skypack.dev/gsap';
import { addFaceLabelsAsPlanes } from '../utils/addFaceLabels.js';

export function createD8(faces = ['1', '2', '3', '4', '5', '6', '7', '8'], color = '#2E7D32') {
  const geometry = new THREE.OctahedronGeometry(1);
  const material = new THREE.MeshStandardMaterial({ color, flatShading: true });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.setScalar(1.5);
  const labelGroup = addFaceLabelsAsPlanes(mesh, geometry, faces);
  mesh.add(labelGroup);

  const rotations = [
    { x: 0, y: 0, z: 0 },
    { x: Math.PI / 2, y: 0, z: Math.PI },
    { x: Math.PI, y: 0, z: Math.PI },
    { x: -Math.PI / 2, y: 0, z: Math.PI },
    { x: Math.PI / 2, y: Math.PI / 2, z: 0 },
    { x: -Math.PI / 2, y: Math.PI / 2, z: 0 },
    { x: Math.PI, y: Math.PI / 2, z: Math.PI / 2 },
    { x: 0, y: Math.PI / 2, z: Math.PI }
  ];

  function rollTo(faceIndex) {
    const target = rotations[faceIndex % 8];

    return new Promise((resolve) => {
      // Bounce animation
      gsap.to(mesh.position, {
        y: 0.55,
        duration: 0.35,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut"
      });

      // Rotation animation
      gsap.to(mesh.rotation, {
        x: target.x + 2 * Math.PI * Math.random(),
        y: target.y + 2 * Math.PI * Math.random(),
        z: target.z + 2 * Math.PI * Math.random(),
        duration: 1.6,
        ease: "power2.out",
        onComplete: () => {
          mesh.position.set(0, 0, 0);
          const event = new CustomEvent('diceSettled', {
            detail: { type: 'D8', face: faceIndex + 1 }
          });
          window.dispatchEvent(event);
          resolve(faceIndex + 1);
        }
      });
    });
  }

  return { mesh, rollTo };
}