import * as THREE from 'three';
export type PartialVector3 = { x?: number; y?: number; z?: number };
export type PartialEuler = { x?: number; y?: number; z?: number };

export type Pose = Record<string, { pos?: PartialVector3; rot?: PartialEuler }>;


/// Figura lego
/* 
lego-completo -- Contiene todas las partes
  -rcadera-cabeza -- Parte superior del cuerpo
    --rbrazo-izquierdo -- Brazo izquierdo
      ---rmano-acc -- Parte de la mano
        ----mano-izquierdaobj  -- Parte de la mano izquierda
          Part1 -- Parte 1 de la mano izquierda
        ----heladoobj -- Parte del helado
          Part1_1 -- Parte 1 del helado
      ---brazo-izquierdaobj -- Parte del brazo izquierdo
        Part1_2 -- Parte 1 del brazo izquierdo
    --acc-cabezaobj -- Accesorio arriba de la cabeza
      Part1_3 -- Parte 1 del accesorio
    --cabezaobj -- Parte de la cabeza
      Part1_4 -- Parte 1 de la cabeza
    --rbrazo-derecho -- Brazo derecho
      ---mano-derechaobj -- Parte de la mano derecha
        Part1_5 -- Parte 1 de la mano derecha
      ---brazo-derechaobj -- Parte del brazo derecho
        Part1_6 -- Parte 1 del brazo derecho
    --torsoobj -- Parte del torso
      Part1_7 -- Parte 1 del torso
    --caderaobj -- Parte de la cadera
      ---Part1_8 -- Parte 1 de la cadera
  -pierna-izquierdaobj -- Parte de la pierna izquierda
    Part1_9 -- Parte 1 de la pierna izquierda
  -pierna-derechaobj -- Parte de la pierna derecha
    Part1_10 -- Parte 1 de la pierna derecha
    */
export const poses: Pose[] = [
  // Subir brazo izquierdo
  {
    'lego-completo': { rot: new THREE.Euler( 0, 0, 0) },
  },
  {
    'rbrazo-izquierdo': { rot: new THREE.Euler(-1, 0, 0) },
    'rbrazo-derecho': { rot: new THREE.Euler(-1, 0, 0) },
    'mano-derechaobj': { rot: new THREE.Euler(0, 0, 0) },
  },
  {
    'pierna-izquierdaobj': { rot: new THREE.Euler(-1, -0.1, 0.5) },
  },
  {
    'pierna-derechaobj': { rot: new THREE.Euler(-1.5, 0, 0) },
  },
  {
    'pierna-izquierdaobj': { rot: new THREE.Euler(-1.5, 0, Math.PI / 6) },
    'lego-completo': { rot: new THREE.Euler( - Math.PI / 6, 0, 0), pos: new THREE.Vector3(0, -0.6, 0) },
  },
  {
    'lego-completo': { rot: new THREE.Euler( 0, 0, 0) },
  },
  {
    'lego-completo': { pos: new THREE.Vector3(0, 0, 0) },
    'rbrazo-izquierdo': { rot: new THREE.Euler(0, 0, 0) },
    'rbrazo-derecho': { rot: new THREE.Euler(0, 0, 0) },
    'pierna-izquierdaobj': { rot: new THREE.Euler(0, 0, 0) },
    'pierna-derechaobj': { rot: new THREE.Euler(0, 0, 0) },
  },
];
  
