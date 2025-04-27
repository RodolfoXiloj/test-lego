// src/partsLoader.ts
import * as THREE from 'three';
import { loadGLTF } from './loader.js';

export type PartMap = Record<string, THREE.Object3D>;

/**
 * Carga la escena glTF y extrae:
 *  - El grupo raíz 'lego-completo'
 *  - Todos sus hijos directos (grupos y meshes)
 */
export async function loadParts(): Promise<PartMap> {
  // 1. Carga la escena completa
  const gltfScene = await loadGLTF('/figure-me/scene.gltf');

  // 2. Obtén el grupo raíz
  const legoGroup = gltfScene.getObjectByName('lego-completo') as THREE.Group;
  if (!legoGroup) {
    console.warn('⚠️ Grupo "lego-completo" no encontrado');
    return {};
  }

  // 3. Añade el grupo raíz al mapa y configura transformaciones globales
  const parts: PartMap = {
    'lego-completo': legoGroup
  };
  legoGroup.castShadow    = true;
  legoGroup.receiveShadow = true;
  //legoGroup.scale.setScalar(0.1);

  // 4. Recorre los hijos directos y añádelos también al mapa
  legoGroup.children.forEach(child => {
    if (!child.name) return;  // ignora nodos sin nombre

    // Configurar cada parte individual (sombra, escala si es necesario)
    child.castShadow    = true;
    child.receiveShadow = true;
    // child.scale.setScalar(0.1); // opcional: escala local
    parts[child.name] = child;
  });

  console.log('🔍 Partes disponibles:', Object.keys(parts).join(', '));            // ej: lego-completo, rcadera-cabeza, pierna-izquierdaobj, ...
  return parts;
}
