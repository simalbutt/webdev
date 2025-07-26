import * as THREE from 'three';
import { gsap } from 'https://cdn.skypack.dev/gsap';
import { addFaceLabelsAsPlanes } from '../utils/addFaceLabels.js';

export function createD4(faces = ['1', '2', '3', '4'], color = '#2E7D32') {
  const geometry = new THREE.TetrahedronGeometry(1);
  const material = new THREE.MeshStandardMaterial({ color, flatShading: true });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.setScalar(1.4);

  const labelGroup = addFaceLabelsAsPlanes(mesh, geometry, faces);
  mesh.add(labelGroup);

  // Precomputed stable orientations for each face (based on bottom face facing down)
  const rotations = [
    { x: Math.PI / 2, y: 0, z: 0 },                         // Face 1 down
    { x: -Math.PI / 2, y: Math.PI, z: 0 },                  // Face 2 down
    { x: Math.PI, y: 0, z: Math.PI / 2 },                   // Face 3 down
    { x: Math.PI / 2, y: Math.PI / 2, z: Math.PI / 2 },     // Face 4 down
  ];

  function rollTo(faceIndex) {
    const target = rotations[faceIndex % 4];

    return new Promise((resolve) => {
      // Bounce animation
      gsap.to(mesh.position, {
        y: 0.4,
        duration: 0.4,
        yoyo: true,
        repeat: 1,
        ease: "back.out(1.7)"
      });

      // Rotation animation
      gsap.to(mesh.rotation, {
        x: target.x + 2 * Math.PI * Math.random(),
        y: target.y + 2 * Math.PI * Math.random(),
        z: target.z + 2 * Math.PI * Math.random(),
        duration: 1.4,
        ease: "power2.out",
        onComplete: () => {
          mesh.position.set(0, 0, 0);

          const event = new CustomEvent('diceSettled', {
            detail: { type: 'D4', face: faceIndex + 1 }
          });
          window.dispatchEvent(event);

          resolve(faceIndex + 1);
        }
      });
    });
  }

  return {
    mesh,
    rollTo
  };
}
