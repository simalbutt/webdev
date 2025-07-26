import * as THREE from "three";

export function addD10Labels(mesh, geometry, labels) {
  const position = geometry.getAttribute("position");
  const index = geometry.getIndex();
  const group = new THREE.Group();
  const kiteCount = 10;

  for (let i = 0; i < kiteCount; i++) {
    const aIndex = index.getX(i * 6);
    const bIndex = index.getX(i * 6 + 1);
    const cIndex = index.getX(i * 6 + 2);
    const dIndex = index.getX(i * 6 + 3);
    const eIndex = index.getX(i * 6 + 4);
    const fIndex = index.getX(i * 6 + 5);

    const a = new THREE.Vector3().fromBufferAttribute(position, aIndex);
    const b = new THREE.Vector3().fromBufferAttribute(position, bIndex);
    const c = new THREE.Vector3().fromBufferAttribute(position, cIndex);
    const d = new THREE.Vector3().fromBufferAttribute(position, dIndex);
    const e = new THREE.Vector3().fromBufferAttribute(position, eIndex);
    const f = new THREE.Vector3().fromBufferAttribute(position, fIndex);

    const center = new THREE.Vector3()
      .add(a).add(b).add(c).add(d).add(e).add(f)
      .divideScalar(6);

    const normal1 = new THREE.Vector3().crossVectors(
      new THREE.Vector3().subVectors(b, a),
      new THREE.Vector3().subVectors(c, a)
    ).normalize();
    const normal2 = new THREE.Vector3().crossVectors(
      new THREE.Vector3().subVectors(e, d),
      new THREE.Vector3().subVectors(f, d)
    ).normalize();
    const normal = normal1.add(normal2).normalize();

    // ✅ Create a clearer label texture
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 256, 256);

    // Background for better contrast (optional)
    ctx.fillStyle = "rgba(0,0,0,0)"; 
    ctx.fillRect(0, 0, 256, 256);

    // Draw label with stroke + fill
    ctx.font = "bold 200px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 12;
    ctx.strokeStyle = "black";    // black border for contrast
    ctx.fillStyle = "white";      // white number
    const text = labels[i % labels.length];
    ctx.strokeText(text, 128, 128);
    ctx.fillText(text, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    const planeGeom = new THREE.PlaneGeometry(0.6, 0.6);
    const planeMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthTest: true,
      depthWrite: true,
      side: THREE.FrontSide
    });

    const label = new THREE.Mesh(planeGeom, planeMat);

    // ✅ Slightly raise label off the face to avoid z-fighting
    label.position.copy(center.clone().add(normal.clone().multiplyScalar(0.05)));

    // ✅ Orient label to face outward
    const quat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      normal
    );
    label.quaternion.copy(quat);

    // ✅ Keep label upright (avoid mirrored/sideways text)
    const upVector = new THREE.Vector3(0, 1, 0);
    const alignQuat = new THREE.Quaternion().setFromUnitVectors(label.up, upVector);
    label.quaternion.multiply(alignQuat);

    group.add(label);
  }

  return group;
}
