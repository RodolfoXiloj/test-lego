import * as THREE from 'three';
import { Pose } from './poses.js';
import { PartMap } from './partsLoader.js';
export class StopMotion {
  private frameIndex = 0;
  private clock = new THREE.Clock();
  constructor(
    private parts: PartMap,
    private poses: Pose[],
    private frameDuration: number // segundos por pose
  ) {}
  update() {
    const elapsed = this.clock.getElapsedTime();
    const idx = Math.floor(elapsed / this.frameDuration) % this.poses.length;
    if (idx !== this.frameIndex) {
      this.frameIndex = idx;
      this.applyPose(this.poses[idx]);
    }
  }
  private applyPose(pose: Pose) {
    for (const [name, tf] of Object.entries(pose)) {
      const obj = this.findPart(name);
      if (!obj) {
        console.warn(`Parte no encontrada: ${name}`);
        continue;
      }
  
      if (tf.pos) {
        if (tf.pos.x !== undefined) obj.position.x = tf.pos.x;
        if (tf.pos.y !== undefined) obj.position.y = tf.pos.y;
        if (tf.pos.z !== undefined) obj.position.z = tf.pos.z;
      }
  
      if (tf.rot) {
        if (tf.rot.x !== undefined) obj.rotation.x = tf.rot.x;
        if (tf.rot.y !== undefined) obj.rotation.y = tf.rot.y;
        if (tf.rot.z !== undefined) obj.rotation.z = tf.rot.z;
      }
    }
  }
  

  private findPart(name: string): THREE.Object3D | undefined {
    // Buscar en el 'lego-completo' todo el árbol
    const root = this.parts['lego-completo'];
    if (!root) return undefined;
    return root.getObjectByName(name);
  }
  
}

