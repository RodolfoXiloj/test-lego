// src/loadingScreen.ts
export class LoadingScreen {
  private container: HTMLDivElement;

  constructor() {
    // Remover el loading inicial del HTML si existe
    const initialLoading = document.getElementById('initial-loading');
    if (initialLoading) {
      initialLoading.remove();
    }

    this.container = document.createElement('div');
    this.container.style.position = 'fixed';
    this.container.style.top = '0';
    this.container.style.left = '0';
    this.container.style.width = '100%';
    this.container.style.height = '100%';
    this.container.style.backgroundColor = '#222';
    this.container.style.display = 'flex';
    this.container.style.justifyContent = 'center';
    this.container.style.alignItems = 'center';
    this.container.style.zIndex = '10000';

    const loadingImg = document.createElement('img');
    loadingImg.src = '/img/loading.webp';
    loadingImg.style.maxWidth = '300px';
    loadingImg.style.maxHeight = '300px';
    this.container.appendChild(loadingImg);
    
    document.body.appendChild(this.container);
  }

  updateProgress(_percent: number) {
    // No se muestra progreso, solo el texto centrado
  }

  hide() {
    this.container.style.transition = 'opacity 0.5s ease';
    this.container.style.opacity = '0';
    setTimeout(() => {
      if (this.container.parentElement) {
        this.container.parentElement.removeChild(this.container);
      }
    }, 500);
  }
}
