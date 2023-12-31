import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene(); // scene=container
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
); // field of view, aspect ratio, view frustum
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});
// sets pixel ratio using renderer
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera); // render=draw

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 }); // wrapping paper for object
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// emits light in all directions like a light bulb
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}
Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load("images/space.jpg");
scene.background = spaceTexture;

const moonTexture = new THREE.TextureLoader().load("images/moon.jpg");
const normalTexture = new THREE.TextureLoader().load("images/normal.jpg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: normalTexture })
);
moon.position.z = 30;
moon.position.setX(-50);
scene.add(moon);

function moveCamera() {
  const scrollPosition = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;
  camera.position.z = scrollPosition * 0.01;
  camera.position.x = scrollPosition * 1;
  camera.rotation.y = scrollPosition * 1;
}
document.body.onscroll = moveCamera;
moveCamera();

// loop to animate our scene
function animate() {
  requestAnimationFrame(animate);
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;
  controls.update();
  renderer.render(scene, camera);
}
animate();
