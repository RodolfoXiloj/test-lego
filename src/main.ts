import * as THREE from 'three';

import { createRenderer } from './renderer.js';
import { scene } from './scene.js';
import { createCamera, handleResize } from './camera.js';
import { setupLights } from './lights.js';
import { createControls, createStats } from './controls.js';
import { createFloor } from './floor.js';
import { loadParts, PartMap } from './partsLoader.js';
import { poses } from './poses.js';
import { StopMotion } from './stopMotion.js';
import { animate } from './animation.js';

async function init() {
  const renderer = createRenderer();
  const camera = createCamera();
  setupLights(scene);
  const controls = createControls(camera, renderer);
  const stats = createStats(); document.body.appendChild(stats.dom);
  scene.add(createFloor());
  // Carga piezas OBJ+MTL
  const parts: PartMap = await loadParts();
  /* Object.values(parts).forEach(obj => {
    obj.scale.setScalar(0.1);           // aplica escala 0.1 a cada parte :contentReference[oaicite:4]{index=4}
    scene.add(obj);
  }); */
  scene.add(parts['lego-completo']);

// y que quieres inspeccionar el grupo 'lego-completo'
const root = parts['lego-completo'];

function printHierarchy(obj: THREE.Object3D, prefix = '') {
  // Imprime el nombre (o el tipo si no tiene nombre)
  console.log(`${prefix}${obj.name || obj.type}`);
  // Recorre hijos
  obj.children.forEach(child => {
    printHierarchy(child, prefix + '  ');
  });
}

// Llama a la función para imprimir desde el nodo raíz
printHierarchy(root);

  // Instancia stop-motion con 0.5s por pose
  const stopMotion = new StopMotion(parts, poses, 0.5);
  window.addEventListener('resize', () => handleResize(renderer, camera));
  animate(renderer, scene, camera, controls, stats, stopMotion);
}
init();
