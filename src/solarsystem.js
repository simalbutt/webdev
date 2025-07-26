import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Pane } from 'tweakpane';


// initialize pane
const pane = new Pane();

// initialize the scene
const scene = new THREE.Scene();

//add textureload
const textureload = new THREE.TextureLoader();
//cube texture loader (hdri -> cubemap)
const cubetextloader=new THREE.CubeTextureLoader()
cubetextloader.setPath('./texture/cubemap/')
// const backgroundtext=textureload.load('/texture/2k_stars_milky_way.jpg')
const backcubemap=cubetextloader.load( [
  'px.png',
  'nx.png',
  'py.png',
  'ny.png',
  'pz.png',
  'nz.png'
] );

//addind background picture
scene.background=backcubemap

//load textures
const suntext = textureload.load("./texture/2k_sun.jpg");
// suntext.colorSpace = THREE.SRGBColorSpace
const mercurytext = textureload.load("./texture/2k_mercury.jpg");
// mercurytext.colorSpace = THREE.SRGBColorSpace
const venustext = textureload.load("./texture/2k_venus_surface.jpg");
// venustext.colorSpace = THREE.SRGBColorSpace
const earthtext = textureload.load("./texture/2k_earth_daymap.jpg");
// earthtext.colorSpace = THREE.SRGBColorSpace
const marstext = textureload.load("./texture/2k_mars.jpg");
// marstext.colorSpace = THREE.SRGBColorSpace
const moontext = textureload.load("./texture/2k_moon.jpg");
// moontext.colorSpace = THREE.SRGBColorSpace

// add stuff here
const spheregeo = new THREE.SphereGeometry(1, 32, 32);
const sunmet = new THREE.MeshBasicMaterial({
  map: suntext,
  // wireframe:true
});
const sun = new THREE.Mesh(spheregeo, sunmet);
sun.scale.setScalar(5);
scene.add(sun);

// const earthmet = new THREE.MeshBasicMaterial({
//   color: "blue",
// });
// const earth = new THREE.Mesh(spheregeo, earthmet);
// scene.add(earth);
// earth.position.x = 10;

// const moonmet = new THREE.MeshBasicMaterial({
//   color: "gray",
// });
// const moon = new THREE.Mesh(spheregeo, moonmet);
// moon.scale.setScalar(0.5);
// moon.position.x = 2;
// earth.add(moon);

//add materials
// add materials
const mercurymat = new THREE.MeshStandardMaterial({
  map: mercurytext,
});
const venusmat = new THREE.MeshStandardMaterial({
  map: venustext,
});
const earthmat = new THREE.MeshStandardMaterial({
  map: earthtext,
});
const marsmat = new THREE.MeshStandardMaterial({
  map: marstext,
});
const moonmat = new THREE.MeshStandardMaterial({
  map: moontext,
});

//because of alot of repetition we will use an array for this
const planets = [
  {
    name: "Mercury",
    radius: 0.5,
    distance: 10,
    speed: 0.01,
    material: mercurymat,
    moons: [],
  },
  {
    name: "Venus",
    radius: 0.8,
    distance: 15,
    speed: 0.007,
    material: venusmat,
    moons: [],
  },
  {
    name: "Earth",
    radius: 1,
    distance: 20,
    speed: 0.005,
    material: earthmat,
    moons: [
      {
        name: "Moon",
        radius: 0.3,
        distance: 3,
        speed: 0.015,
      },
    ],
  },
  {
    name: "Mars",
    radius: 0.7,
    distance: 25,
    speed: 0.003,
    material: marsmat,
    moons: [
      {
        name: "Phobos",
        radius: 0.1,
        distance: 2,
        speed: 0.02,
      },
      {
        name: "Deimos",
        radius: 0.2,
        distance: 3,
        speed: 0.015,
        color: 0xffffff,
      },
    ],
  },
];

//craeting the meshes
const planetmesh = planets.map((planet) => {
  //creating mesh
  const meshes = new THREE.Mesh(spheregeo, planet.material);
  //set scale
  meshes.scale.setScalar(planet.radius);
  //set position
  meshes.position.x=(planet.distance);
  //add scene
  scene.add(meshes);
  //looping and adding moons
  planet.moons.forEach((moon) => {
    //creating mesh
    const moonmesh = new THREE.Mesh(spheregeo, moonmat);
    //set scale
    moonmesh.scale.setScalar(moon.radius);
    // //set position
    moonmesh.position.x=(moon.distance);
    meshes.add(moonmesh);
  });
  
  return meshes;
});

// console.log(planetmesh)

//adding light
// const light = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(50, 50, 50);
scene.add(directionalLight);
// const pointlight=new THREE.PointLight('white',500)
// scene.add(pointlight)


// initialize the camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  400
);
camera.position.z = 100;
camera.position.y = 5;

// initialize the renderer
const canvas = document.querySelector("canvas");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// add controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 200;
controls.minDistance = 20;

// add resize listener
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// const clock = new THREE.Clock();

// render loop
const renderloop = () => {
  //   const elapsedtime = clock.getElapsedTime();
  //adding animations
  //   earth.rotation.y += 0.01;
  //   earth.position.x=Math.sin(elapsedtime)*10//10 is the radius of sphere(distance btw moon and sun)
  //   earth.position.z=Math.cos(elapsedtime)*10
  //   moon.position.x = Math.sin(elapsedtime)*2
  //   moon.position.z = Math.cos(elapsedtime)*2


  //adding animations
  planetmesh.forEach((planet, pindex)=>{
    planet.rotation.y +=  planets[pindex].speed
    planet.position.x = Math.sin(planet.rotation.y) * planets[pindex].distance
    planet.position.z = Math.cos(planet.rotation.y) * planets[pindex].distance
    planet.children.forEach((moon, mindex) =>{
      moon.rotation.y += planets[pindex].moons[mindex].speed
      moon.position.x = Math.sin(moon.rotation.y) * planets[pindex].moons[mindex].distance
      moon.position.z = Math.cos(moon.rotation.y) * planets[pindex].moons[mindex].distance
    })
  })

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop();
