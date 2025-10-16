import * as THREE from 'three';
export function setupLights(scene: THREE.Scene) {
  // Luz ambiente mas intensa para reducir necesidad de sombras
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  
  // Luz hemisferica para iluminacion suave
  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4);
  hemi.position.set(0, 20, 0);
  scene.add(hemi);
  
  // Luz direccional principal (UNICA con sombras para performance)
  const dir = new THREE.DirectionalLight(0xffffff, 0.6);
  dir.position.set(5, 10, 5);
  dir.castShadow = true;
  
  // Reducir shadow map size para mejor performance (512 es suficiente para un modelo pequeno)
  dir.shadow.mapSize.set(512, 512);
  
  // Optimizar shadow camera para reducir area de renderizado
  dir.shadow.camera.near = 1;
  dir.shadow.camera.far = 30;
  dir.shadow.camera.left = -10;
  dir.shadow.camera.right = 10;
  dir.shadow.camera.top = 10;
  dir.shadow.camera.bottom = -10;
  
  scene.add(dir);
  
  // Luz de relleno SIN sombras (mas rapido)
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.2);
  fillLight.position.set(-5, 5, -5);
  fillLight.castShadow = false;
  scene.add(fillLight);
}