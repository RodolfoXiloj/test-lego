// src/loader.ts
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

/**
 * Carga un archivo glTF o GLB como THREE.Group.
 * @param url Ruta pública al .gltf o .glb
 */
export function loadGLTF(url: string): Promise<THREE.Group> {
  return new Promise((resolve, reject) => {
    // 1. Configurar DRACOLoader si tu archivo usa Draco Compression
    const draco = new DRACOLoader();
    draco.setDecoderPath('/draco/');               // Ruta a los decodificadores :contentReference[oaicite:6]{index=6}
    draco.preload();

    // 2. Instanciar GLTFLoader y asignar DRACOLoader
    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);

    // 3. Cargar el glTF/GLB
    loader.load(
      url,
      (gltf) => resolve(gltf.scene),               // Retorna la escena principal :contentReference[oaicite:7]{index=7}
      undefined,
      (err) => reject(err)
    );
  });
}
