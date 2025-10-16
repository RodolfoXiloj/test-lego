import * as THREE from 'three';
export function setupLights(scene: THREE.Scene) {
  // Luz ambiente suave
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  
  // Luz hemisférica para iluminación suave
  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.3);
  hemi.position.set(0, 20, 0);
  scene.add(hemi);
  
  // Luz direccional principal
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(5, 10, 5);
  dir.castShadow = true;
  dir.shadow.mapSize.set(2048, 2048);
  scene.add(dir);
  
  // Luz de relleno desde el lado opuesto
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
  fillLight.position.set(-5, 5, -5);
  scene.add(fillLight);
}