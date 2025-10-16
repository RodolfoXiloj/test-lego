import * as THREE from 'three';
import { loadGLTF } from './loader.js';

export type PartMap = Record<string, THREE.Object3D>;

export interface LoadedModel {
  parts: PartMap;
  animations: THREE.AnimationClip[];
}

/**
 * Función para recolectar todas las partes (meshes y grupos con nombre)
 */
function collectParts(obj: THREE.Object3D, parts: PartMap): void {
  if (obj.name) {
    parts[obj.name] = obj;
    
    // Solo objetos principales con sombras (optimizacion)
    obj.castShadow = true;
    obj.receiveShadow = false; // Desactivar receive shadow en la mayoria
    
    // Configurar materiales para que respondan correctamente a la luz
    if (obj instanceof THREE.Mesh) {
      // Asegurar que la geometria tenga bounding box/sphere actualizado
      const geometry = obj.geometry as THREE.BufferGeometry;
      if (!geometry.boundingSphere) {
        geometry.computeBoundingSphere();
      }
      if (!geometry.boundingBox) {
        geometry.computeBoundingBox();
      }
      
      if (obj.material) {
        const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
        materials.forEach(mat => {
          if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
            // Preservar colores y texturas originales
            mat.needsUpdate = true;
            // Ajustar roughness y metalness para mejor apariencia
            if (mat.roughness === undefined) mat.roughness = 0.7;
            if (mat.metalness === undefined) mat.metalness = 0.0;
            // Reducir envMapIntensity para performance
            mat.envMapIntensity = 0.5;
          } else if (mat instanceof THREE.MeshBasicMaterial) {
            // Si es MeshBasicMaterial, no responde a luces - convertir a Standard
            const newMat = new THREE.MeshStandardMaterial({
              map: mat.map,
              color: mat.color,
              transparent: mat.transparent,
              opacity: mat.opacity,
              side: mat.side,
            });
            if (Array.isArray(obj.material)) {
              const index = obj.material.indexOf(mat);
              obj.material[index] = newMat;
            } else {
              obj.material = newMat;
            }
          }
        });
      }
    }
  }
  
  obj.children.forEach((child: THREE.Object3D) => {
    collectParts(child, parts);
  });
}

/**
 * Carga la escena GLB desde /model3d y extrae todas las partes
 */
export async function loadParts(onProgress?: (percent: number) => void): Promise<LoadedModel> {
  const gltfResult = await loadGLTF('/model3d/untitled.glb', onProgress);
  const gltfScene = gltfResult.scene;
  
  const parts: PartMap = {};
  collectParts(gltfScene, parts);
  
  parts['scene'] = gltfScene;
  gltfScene.castShadow = true;
  gltfScene.receiveShadow = true;
  
  // Ocultar cilindros no deseados
  const cylindersToHide: string[] = [
    'FinishedRHBool', // Cilindro mano derecha
    'FinishedRLBool', // Cilindro mano izquierda
  ];
  
  cylindersToHide.forEach(pieceName => {
    if (parts[pieceName]) {
      parts[pieceName].visible = false;
    }
  });
  
  return {
    parts,
    animations: gltfResult.animations
  };
}
