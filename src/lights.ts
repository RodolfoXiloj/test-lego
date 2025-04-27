import * as THREE from 'three';
export function setupLights(scene: THREE.Scene) {
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
  hemi.position.set(0, 20, 0);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xffffff, 1);
  dir.position.set(5, 10, 5);
  dir.castShadow = true;
  dir.shadow.mapSize.set(2048, 2048);
  scene.add(dir);
  scene.add(new THREE.DirectionalLightHelper(dir, 1));
  scene.add(new THREE.GridHelper(10, 10));
  scene.add(new THREE.AxesHelper(5));
}