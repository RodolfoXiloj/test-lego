import * as THREE from 'three';
import { AnimationController } from './animationController.js';

export class ClickHandler {
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private camera: THREE.Camera;
  private targetObject: THREE.Object3D;
  private animationController: AnimationController | null;
  private clickAnimationName: string;

  constructor(
    camera: THREE.Camera,
    targetObject: THREE.Object3D,
    animationController: AnimationController | null = null,
    clickAnimationName: string = 'click'
  ) {
    this.raycaster = new THREE.Raycaster();
    // Aumentar threshold para mejor deteccion
    this.raycaster.params.Points!.threshold = 0.5;
    this.raycaster.params.Line!.threshold = 0.5;
    
    this.mouse = new THREE.Vector2();
    this.camera = camera;
    this.targetObject = targetObject;
    this.animationController = animationController;
    this.clickAnimationName = clickAnimationName;

    // Escuchar eventos de click
    window.addEventListener('click', this.onClick.bind(this), false);
    
    console.log(`ClickHandler inicializado. Animacion de click: "${clickAnimationName}"`);
  }

  private onClick(event: MouseEvent): void {
    // Ignorar clicks en la UI (botones de animacion)
    const target = event.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      return; // No procesar si es un boton
    }

    // Calcular posicion del mouse normalizada (-1 a +1)
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Actualizar el raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Buscar intersecciones con el objeto (recursive = true para todos los hijos)
    const intersects = this.raycaster.intersectObject(this.targetObject, true);

    console.log(`Click en (${event.clientX}, ${event.clientY}), intersecciones: ${intersects.length}`);

    if (intersects.length > 0) {
      console.log('Click detectado en el modelo!', intersects[0].object.name || 'sin nombre');
      
      // Reproducir animacion si existe
      if (this.animationController) {
        this.animationController.play(this.clickAnimationName, false); // false = reproducir una sola vez
      } else {
        console.warn('No hay AnimationController configurado');
      }

      // Efecto visual opcional: highlight del objeto clickeado
      this.highlightObject(intersects[0].object);
    } else {
      console.log('Click fuera del modelo');
    }
  }

  private highlightObject(object: THREE.Object3D): void {
    // Efecto visual temporal al hacer click
    if (object instanceof THREE.Mesh && object.material) {
      const originalEmissive = (object.material as any).emissive?.clone();
      const originalIntensity = (object.material as any).emissiveIntensity;

      // Flash blanco
      if ((object.material as any).emissive) {
        (object.material as any).emissive = new THREE.Color(0xffffff);
        (object.material as any).emissiveIntensity = 0.5;

        // Restaurar después de 200ms
        setTimeout(() => {
          if (originalEmissive) {
            (object.material as any).emissive = originalEmissive;
          }
          if (originalIntensity !== undefined) {
            (object.material as any).emissiveIntensity = originalIntensity;
          }
        }, 200);
      }
    }
  }

  dispose(): void {
    window.removeEventListener('click', this.onClick.bind(this));
  }
}
