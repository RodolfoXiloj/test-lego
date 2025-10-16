import * as THREE from 'three';

export class AnimationController {
  private mixer: THREE.AnimationMixer;
  private animations: THREE.AnimationClip[];
  private actions: Map<string, THREE.AnimationAction> = new Map();
  private currentAction: THREE.AnimationAction | null = null;
  private uiContainer: HTMLDivElement;

  constructor(model: THREE.Object3D, animations: THREE.AnimationClip[]) {
    this.mixer = new THREE.AnimationMixer(model);
    this.animations = animations;
    
    // Crear acciones para cada animación
    animations.forEach(clip => {
      const action = this.mixer.clipAction(clip);
      this.actions.set(clip.name, action);
    });

    // Crear UI
    this.uiContainer = this.createUI();
    document.body.appendChild(this.uiContainer);

    console.log(`AnimationController inicializado con ${animations.length} animaciones`);
  }

  private createUI(): HTMLDivElement {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.padding = '15px';
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    container.style.color = 'white';
    container.style.fontFamily = 'monospace';
    container.style.fontSize = '12px';
    container.style.borderRadius = '8px';
    container.style.zIndex = '1000';
    container.style.minWidth = '200px';
    container.style.maxHeight = '80vh';
    container.style.overflowY = 'auto';

    const title = document.createElement('div');
    title.textContent = '🎬 Animaciones';
    title.style.marginBottom = '10px';
    title.style.fontWeight = 'bold';
    title.style.fontSize = '14px';
    container.appendChild(title);

    if (this.animations.length === 0) {
      const noAnimText = document.createElement('div');
      noAnimText.textContent = 'No hay animaciones en el GLB';
      noAnimText.style.color = '#999';
      container.appendChild(noAnimText);
      return container;
    }

    // Botón para detener todas las animaciones
    const stopBtn = this.createButton('Stop All', () => {
      this.stopAll();
    });
    stopBtn.style.marginBottom = '10px';
    stopBtn.style.backgroundColor = '#d9534f';
    container.appendChild(stopBtn);

    // Crear un botón para cada animación
    this.animations.forEach((clip, index) => {
      const btnContainer = document.createElement('div');
      btnContainer.style.marginBottom = '8px';

      const button = this.createButton(
        `▶ ${clip.name || `Anim ${index + 1}`}`,
        () => this.play(clip.name)
      );
      
      const info = document.createElement('span');
      info.textContent = ` (${clip.duration.toFixed(1)}s)`;
      info.style.color = '#888';
      info.style.fontSize = '10px';
      info.style.marginLeft = '5px';

      btnContainer.appendChild(button);
      btnContainer.appendChild(info);
      container.appendChild(btnContainer);
    });

    return container;
  }

  private createButton(text: string, onClick: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.width = '100%';
    button.style.padding = '8px 12px';
    button.style.backgroundColor = '#5cb85c';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.fontFamily = 'monospace';
    button.style.fontSize = '12px';
    button.style.transition = 'background-color 0.2s';

    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = '#4cae4c';
    });

    button.addEventListener('mouseleave', () => {
      if (button.style.backgroundColor !== '#d9534f') {
        button.style.backgroundColor = '#5cb85c';
      }
    });

    button.addEventListener('click', onClick);
    return button;
  }

  play(animationName: string, loop: boolean = true) {
    const action = this.actions.get(animationName);
    if (!action) {
      console.warn(`Animación "${animationName}" no encontrada`);
      return;
    }

    // Detener animación actual si existe
    if (this.currentAction && this.currentAction !== action) {
      this.currentAction.fadeOut(0.5);
    }

    // Reproducir nueva animación
    action.reset();
    action.fadeIn(0.5);
    action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, loop ? Infinity : 1);
    action.play();
    
    this.currentAction = action;
    console.log(`Reproduciendo: "${animationName}"`);
  }

  stopAll() {
    this.actions.forEach(action => {
      action.stop();
    });
    this.currentAction = null;
    console.log('Todas las animaciones detenidas');
  }

  update(deltaTime: number) {
    this.mixer.update(deltaTime);
  }

  dispose() {
    this.stopAll();
    if (this.uiContainer && this.uiContainer.parentElement) {
      this.uiContainer.parentElement.removeChild(this.uiContainer);
    }
  }
}
