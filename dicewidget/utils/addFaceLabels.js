import * as THREE from "three";

export function addFaceLabelsAsPlanes(mesh, geometry, labels) {
  const position = geometry.getAttribute("position");
  const faceCount = position.count / 3;
  const group = new THREE.Group();

  for (let i = 0; i < faceCount; i++) {
    // Get triangle vertices
    const vA = new THREE.Vector3().fromBufferAttribute(position, i * 3);
    const vB = new THREE.Vector3().fromBufferAttribute(position, i * 3 + 1);
    const vC = new THREE.Vector3().fromBufferAttribute(position, i * 3 + 2);

    // Compute face center and normal
    const center = new THREE.Vector3()
      .addVectors(vA, vB)
      .add(vC)
      .divideScalar(3);
    const cb = new THREE.Vector3().subVectors(vC, vB);
    const ab = new THREE.Vector3().subVectors(vA, vB);
    const normal = new THREE.Vector3().crossVectors(cb, ab).normalize();

    // Create label canvas
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 256, 256);
    // ctx.fillStyle = "white";
    ctx.font = "bold 180px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 200px Arial"; // bigger & more readable
    ctx.fillStyle = "#ffffff"; // bright white
    ctx.strokeStyle = "#000000"; // black border for contrast
    ctx.lineWidth = 10;
    ctx.strokeText(labels[i % labels.length], 128, 128);
    ctx.fillText(labels[i % labels.length], 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    const planeGeom = new THREE.PlaneGeometry(0.5, 0.5);
    const planeMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    });

    const plane = new THREE.Mesh(planeGeom, planeMat);

    // Slightly above surface to avoid z-fighting
    const labelPos = center.clone().add(normal.clone().multiplyScalar(0.02));
    plane.position.copy(labelPos);

    // Face normal alignment (perpendicular)
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      normal
    );
    plane.quaternion.copy(quaternion);

    // Ensure upright text: rotate around normal (Z-axis in plane space)
    // Make label face camera upright
    plane.lookAt(normal.clone().add(center)); // Face outward

    // Force upright rotation: align Z-axis
    const alignUp = new THREE.Vector3(0, 1, 0);
    const labelQuat = new THREE.Quaternion().setFromUnitVectors(
      plane.up.clone().normalize(),
      alignUp
    );
    plane.quaternion.multiply(labelQuat);

    group.add(plane);
  }

  return group;
}
