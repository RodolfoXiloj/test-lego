import * as THREE from 'three';
export function createRenderer(): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({ 
    antialias: false, // Desactivar antialiasing para mejor performance
    alpha: false,
    powerPreference: 'high-performance', // Priorizar performance
    stencil: false,
    depth: true
  });
  
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap; // Cambiar a BasicShadowMap (mas rapido)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Limitar pixel ratio
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  // Configurar el tone mapping para colores correctos
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  
  document.body.appendChild(renderer.domElement);
  return renderer;
}