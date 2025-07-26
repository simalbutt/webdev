 import * as THREE from 'three';
import { DiceController } from './utils/controler.js';

// Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color('#202020');

const camera = new THREE.PerspectiveCamera(
  50,
  150/150,
  0.1,
  1000
);
camera.aspect = 150/150; // Fixed aspect ratio
camera.position.z = 3.9;

// Renderer
const container = document.getElementById("diceCanvas");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: document.getElementById("diceCanvas") });
// inside main.js after setting renderer
renderer.setSize(150, 150);
renderer.setPixelRatio(window.devicePixelRatio);


document.body.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(3, 5, 2);
scene.add(directionalLight);
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
scene.add(hemiLight);

// Dice Controller
const diceController = new DiceController(scene, camera, renderer);
diceController.setDice('d4',['1', '2', '3', '4'], '#2a2063ff');

// Animate
function animate() {
  requestAnimationFrame(animate);
  diceController.update();
  renderer.render(scene, camera);
}
animate();

// Roll on button click
document.getElementById('rollBtn').addEventListener('click', () => {
  const result = Math.floor(Math.random() * 4) + 1; // for D4
  diceController.roll(result).then(value => {
    console.log('Rolled:', value);
  });
});
window.addEventListener('diceSettled', (e) => {
  console.log(` ${e.detail.type} settled on face ${e.detail.face}`);
});


// Resize handling
window.addEventListener("resize", () => {
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});
