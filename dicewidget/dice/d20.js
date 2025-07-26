import * as THREE from "three";
import { gsap } from "https://cdn.skypack.dev/gsap";
import { addFaceLabelsAsPlanes } from "../utils/addFaceLabels.js";

export function createD20(
  faces = Array.from({ length: 20 }, (_, i) => (i + 1).toString()),
  color = "#6A1B9A"
) {
  const geometry = new THREE.IcosahedronGeometry(1, 0);
  const material = new THREE.MeshStandardMaterial({ color, flatShading: true });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.setScalar(1.5);
  const labelGroup = addFaceLabelsAsPlanes(mesh, geometry, faces);
  if (labelGroup) mesh.add(labelGroup);

  // Approximate face orientations (You can improve these if needed)
  // Generate stable orientations dynamically
  function computeD20Rotations() {
    const tempGeo = new THREE.IcosahedronGeometry(1, 0);
    const posAttr = tempGeo.getAttribute("position");
    const rotations = [];

    for (let i = 0; i < posAttr.count; i += 3) {
      const vA = new THREE.Vector3().fromBufferAttribute(posAttr, i);
      const vB = new THREE.Vector3().fromBufferAttribute(posAttr, i + 1);
      const vC = new THREE.Vector3().fromBufferAttribute(posAttr, i + 2);

      // Face center
      const center = new THREE.Vector3()
        .addVectors(vA, vB)
        .add(vC)
        .divideScalar(3);
      const normal = center.clone().normalize();

      // Calculate rotation quaternion from +Z to this face normal
      const quat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        normal
      );

      const euler = new THREE.Euler().setFromQuaternion(quat, "XYZ");
      rotations.push({ x: euler.x, y: euler.y, z: euler.z });
    }

    return rotations;
  }

  const rotations = computeD20Rotations();

  function rollTo(faceIndex) {
    const target = rotations[faceIndex % rotations.length];
    return new Promise((resolve) => {
      gsap.to(mesh.position, {
        y: 0.6,
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        ease: "elastic.out(1, 0.5)",
      });

      gsap.to(mesh.rotation, {
        x: target.x + Math.PI * 4 * Math.random(),
        y: target.y + Math.PI * 4 * Math.random(),
        z: target.z + Math.PI * 4 * Math.random(),
        duration: 1.8,
        ease: "power2.out",
        onComplete: () => {
          mesh.position.set(0, 0, 0);
          const event = new CustomEvent("diceSettled", {
            detail: { type: "D20", face: faceIndex + 1 },
          });
          window.dispatchEvent(event);
          resolve(faceIndex + 1);
        },
      });
    });
  }

  return {
    mesh,
    rollTo,
  };
}
