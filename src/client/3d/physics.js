export const addPhysicsProps = (mesh, impostor, mass, restitution, scene) => {
	mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, impostor, { mass: mass, restitution: restitution }, scene);
}
