import * as THREE from 'three';
import { StopMotion } from './stopMotion.js';
export function animate(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  controls: any,
  stats: any,
  stopMotion?: StopMotion
) {
  const loop = () => {
    requestAnimationFrame(loop);
    if (stopMotion) stopMotion.update();
    controls.update();
    stats.update();
    renderer.render(scene, camera);
  };
  loop();
}