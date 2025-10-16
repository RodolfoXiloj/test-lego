import * as THREE from 'three';
import { createRenderer } from './renderer.js';
import { scene } from './scene.js';
import { createCamera, handleResize } from './camera.js';
import { setupLights } from './lights.js';
import { createControls, createStats } from './controls.js';
import { createFloor } from './floor.js';
import { loadParts } from './partsLoader.js';
import { HeadTracking } from './headTracking.js';
import { AnimationController } from './animationController.js';
import { ClickHandler } from './clickHandler.js';
import { LoadingScreen } from './loadingScreen.js';

async function init() {
  // Mostrar loading screen
  const loadingScreen = new LoadingScreen();
  const renderer = createRenderer();
  const camera = createCamera();
  setupLights(scene);
  const controls = createControls(camera, renderer);
  const stats = createStats(); document.body.appendChild(stats.dom);
  scene.add(createFloor());
  
  // Carga piezas y animaciones desde el archivo GLB con progreso
  const { parts, animations } = await loadParts((percent) => {
    loadingScreen.updateProgress(percent);
  });
  
  // Ocultar loading screen
  loadingScreen.hide();
  
  const root = parts['scene'];
  
  if (root) {
    root.scale.setScalar(0.1);
    scene.add(root);
  }
  
  // Configurar head tracking
  let headTracking: HeadTracking | null = null;
  const headBone = parts['Head_1'];
  
  if (headBone) {
    headTracking = new HeadTracking(headBone);
    console.log('Head tracking activado - La cabeza seguirá al cursor');
  } else {
    console.warn('No se encontró el hueso de la cabeza (Head_1)');
  }
  
  // Configurar controlador de animaciones
  let animationController: AnimationController | null = null;
  if (root && animations.length > 0) {
    animationController = new AnimationController(root, animations);
    console.log(`AnimationController creado con ${animations.length} animaciones`);
  } else if (animations.length === 0) {
    console.log('No se encontraron animaciones en el GLB');
  }
  
  // Configurar click handler para detectar clicks en el modelo
  if (root) {
    // Buscar si existe una animación llamada "click" o similar
    const clickAnimNames = ['click', 'Click', 'onclick', 'OnClick', 'action'];
    let clickAnimName = 'click'; // Por defecto
    
    if (animations.length > 0) {
      const foundAnim = animations.find(anim => 
        clickAnimNames.some(name => anim.name.toLowerCase().includes(name.toLowerCase()))
      );
      if (foundAnim) {
        clickAnimName = foundAnim.name;
        console.log(`Animación de click detectada: "${clickAnimName}"`);
      } else {
        console.log(`No se encontró animación de "click". Usando la primera animación disponible.`);
        clickAnimName = animations[0]?.name || 'click';
      }
    }
    
    // Crear el handler (no necesitamos guardar la referencia)
    new ClickHandler(camera, root, animationController, clickAnimName);
    console.log(`ClickHandler configurado. Click en el modelo para reproducir: "${clickAnimName}"`);
  }
  
  window.addEventListener('resize', () => handleResize(renderer, camera));
  
  // Loop de renderizado con head tracking y animaciones
  const clock = new THREE.Clock();
  
  function animateLoop() {
    requestAnimationFrame(animateLoop);
    
    const deltaTime = clock.getDelta();
    
    // Actualizar head tracking
    if (headTracking) {
      headTracking.update();
    }
    
    // Actualizar animaciones
    if (animationController) {
      animationController.update(deltaTime);
    }
    
    controls.update();
    stats.update();
    renderer.render(scene, camera);
  }
  animateLoop();
}
init();
