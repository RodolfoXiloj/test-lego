import * as THREE from 'three';
export function createFloor(): THREE.Mesh {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: 0x888888 })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -0.01;
  mesh.receiveShadow = true;
  return mesh;
}