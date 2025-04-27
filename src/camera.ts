import * as THREE from 'three';
export function createCamera(): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 10);
  return camera;
}
export function handleResize(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera) {
  const canvas = renderer.domElement;
  const width  = (canvas.clientWidth * window.devicePixelRatio) | 0;
  const height = (canvas.clientHeight * window.devicePixelRatio) | 0;
  if (canvas.width !== width || canvas.height !== height) {
    renderer.setSize(width, height, false);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
}
