import * as THREE from 'three';

export class HeadTracking {
  private headBone: THREE.Object3D;
  private mouse = new THREE.Vector2();
  private targetRotation = new THREE.Euler();
  private originalRotation = new THREE.Euler();
  private lerpSpeed = 0.25;
  
  constructor(headBone: THREE.Object3D) {
    this.headBone = headBone;
    
    // Guardar la rotación original
    this.originalRotation.copy(headBone.rotation);
    
    // Escuchar movimiento del mouse
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
  }
  
  private onMouseMove(event: MouseEvent): void {
    // Convertir posición del mouse a coordenadas normalizadas (-1 a +1)
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }
  
  update(): void {
    // Calcular la rotación objetivo basada en la posición del mouse
    // Limitar el rango de movimiento para que sea natural
    const maxRotationX = 0.5; // ~28 grados
    const maxRotationY = 0.7; // ~40 grados
    
    // Calcular rotación objetivo (invertir mouse.y para corregir la dirección)
    this.targetRotation.x = this.originalRotation.x - (this.mouse.y * maxRotationX);
    this.targetRotation.y = this.originalRotation.y + (this.mouse.x * maxRotationY);
    this.targetRotation.z = this.originalRotation.z;
    
    // Interpolar suavemente hacia la rotación objetivo
    this.headBone.rotation.x = THREE.MathUtils.lerp(
      this.headBone.rotation.x,
      this.targetRotation.x,
      this.lerpSpeed
    );
    
    this.headBone.rotation.y = THREE.MathUtils.lerp(
      this.headBone.rotation.y,
      this.targetRotation.y,
      this.lerpSpeed
    );
    
    this.headBone.rotation.z = THREE.MathUtils.lerp(
      this.headBone.rotation.z,
      this.targetRotation.z,
      this.lerpSpeed
    );
  }
  
  dispose(): void {
    window.removeEventListener('mousemove', this.onMouseMove.bind(this));
  }
}
