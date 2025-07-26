// dice/d10.js
import * as THREE from 'three';
import { gsap } from 'https://cdn.skypack.dev/gsap';
import { addD10Labels } from '../utils/addD10Labels.js';

export function createD10(faces = ['0','1','2','3','4','5','6','7','8','9'], color = '#ff0055') {
  const geometry = new THREE.BufferGeometry();

  // Create D10 geometry (pentagonal trapezohedron)
  const vertices = [];
  const indices = [];
  const phi = (1 + Math.sqrt(5)) / 2;

  vertices.push(0, phi, 0); // 0 - top
  vertices.push(0, -phi, 0); // 1 - bottom

  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
    vertices.push(Math.cos(angle), 1, Math.sin(angle)); // 2-6
  }

  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI / 5) - Math.PI / 2 + Math.PI / 5;
    vertices.push(Math.cos(angle), -1, Math.sin(angle)); // 7-11
  }

  // Top
  for (let i = 0; i < 5; i++) {
    const next = (i + 1) % 5;
    indices.push(0, 2 + i, 2 + next);
  }

  // Middle
  for (let i = 0; i < 5; i++) {
    const next = (i + 1) % 5;
    indices.push(2 + i, 7 + i, 2 + next);
    indices.push(2 + next, 7 + i, 7 + next);
  }

  // Bottom
  for (let i = 0; i < 5; i++) {
    const next = (i + 1) % 5;
    indices.push(1, 7 + next, 7 + i);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({ color, flatShading: true 
  });
  const mesh = new THREE.Mesh(geometry, material);

  const labels = addD10Labels(mesh, geometry, faces);
  mesh.add(labels);

  // Approximate stable orientations for flat landing
  const rotations = [
    { x: 0, y: 0, z: 0 },
    { x: 0.4, y: 0.5, z: 0 },
    { x: -0.6, y: 1.5, z: 0.5 },
    { x: 1.2, y: 0.2, z: 0.6 },
    { x: -1, y: -0.8, z: 0.3 },
    { x: 0.5, y: -1.5, z: 0.2 },
    { x: 0.9, y: 1, z: 0.1 },
    { x: -0.5, y: -0.5, z: 0.8 },
    { x: -1.2, y: 1.5, z: 0.2 },
    { x: 1.5, y: -1.2, z: 0.4 },
  ];

  function rollTo(faceIndex) {
    const target = rotations[faceIndex % 10];

    return new Promise(resolve => {
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
        x: target.x + Math.PI * 2 * Math.random(),
        y: target.y + Math.PI * 2 * Math.random(),
        z: target.z + Math.PI * 2 * Math.random(),
        duration: 1.6,
        ease: 'power2.out',
        onComplete: () => {
          mesh.position.set(0, 0, 0);
          const event = new CustomEvent('diceSettled', {
            detail: { type: 'D10', face: faceIndex + 1 }
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
