import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
hemi.position.set(0, 20, 0);
scene.add(hemi);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 5);
dirLight.castShadow = true;
dirLight.shadow.mapSize.set(2048, 2048);
scene.add(dirLight);

scene.add(new THREE.DirectionalLightHelper(dirLight, 1, 0xff0000));
scene.add(new THREE.GridHelper(10, 10));
scene.add(new THREE.AxesHelper(5));

const stats = new Stats();
document.body.appendChild(stats.dom);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: 0x888888 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.01;
floor.receiveShadow = true;
scene.add(floor);

// === Cargar modelo DAE ===
const colladaLoader = new ColladaLoader();
colladaLoader.load('/figure-me/figure.dae',
  (collada) => {
    const model = collada.scene;
    model.scale.set(0.1, 0.1, 0.1);
    model.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.add(model);
    console.log('Modelo DAE cargado');
  },
  undefined,
  (err) => console.error('Error cargando DAE:', err)
);

window.addEventListener('resize', () => {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth * window.devicePixelRatio | 0;
  const height = canvas.clientHeight * window.devicePixelRatio | 0;
  if (canvas.width !== width || canvas.height !== height) {
    renderer.setSize(width, height, false);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
});

function animate(time: number) {
  requestAnimationFrame(animate);
  controls.update();
  stats.update();
  renderer.render(scene, camera);
}
animate(0);
