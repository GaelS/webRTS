import uuid from 'uuid';
import { vector3 } from '../utils.js';
import { addPhysicsProps } from '../physics.js';

export const createGuy = ( scene, qty, type, buildingID ) => {
	let buildingPosition = !!buildingID ? scene.getMeshByID(buildingID).position.add(vector3(30,30,30)) : vector3( scene.meshes.length+ 30,scene.meshes.length+ 30,scene.meshes.length+ 30 );
	
	return [...Array(qty).keys()].map( i => {
		
		let s = BABYLON.Mesh.CreateBox( uuid.v1(), 2, scene ); 
		s.position = buildingPosition;
		addPhysicsProps(s, BABYLON.PhysicsImpostor.BoxImpostor, 1, 0.01, 0.001, scene);
		s.material = scene.getMaterialByName('redMaterial');
		s.onSelect = (evt) => { s.material = scene.getMaterialByName('blackerMaterial') };
		s.onDeselect = (evt) => { s.material = scene.getMaterialByName('redMaterial') };
		s.type = type;
        s.class = 'CHARACTER';
		return s.id;
	} );
};