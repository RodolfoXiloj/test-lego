import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export interface GLTFResult {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
}

/**
 * Carga un archivo glTF o GLB como THREE.Group con animaciones.
 * @param url Ruta pública al .gltf o .glb
 */
export function loadGLTF(url: string): Promise<GLTFResult> {
  return new Promise((resolve, reject) => {
    // 1. Configurar DRACOLoader si tu archivo usa Draco Compression
    const draco = new DRACOLoader();
    draco.setDecoderPath('/draco/');
    draco.preload();

    // 2. Instanciar GLTFLoader y asignar DRACOLoader
    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);

    // 3. Cargar el glTF/GLB
    loader.load(
      url,
      (gltf) => {
        // Configurar texturas y materiales
        const texturesFound: THREE.Texture[] = [];
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((mat) => {
              // Buscar todos los tipos de texturas
              if (mat.map && !texturesFound.includes(mat.map)) texturesFound.push(mat.map);
              if (mat.normalMap && !texturesFound.includes(mat.normalMap)) texturesFound.push(mat.normalMap);
              
              // Configurar normal maps (no usan color space)
              if (mat.normalMap) {
                mat.normalMap.colorSpace = THREE.NoColorSpace;
              }
              
              // Si hay color maps, configurar sRGB
              if (mat.map) {
                mat.map.colorSpace = THREE.SRGBColorSpace;
              }
            });
          }
        });
        
        // Log resumido
        console.log(`Modelo cargado: ${texturesFound.length} texturas, ${gltf.animations?.length || 0} animaciones`);
        
        resolve({
          scene: gltf.scene,
          animations: gltf.animations || []
        });
      },
      undefined,
      (err) => reject(err)
    );
  });
}
