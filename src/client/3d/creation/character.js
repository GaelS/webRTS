import uuid from 'uuid';
import { vector3 } from '../utils.js';
import { addPhysicsProps } from '../physics.js';

export const createGuy = ( scene, qty, type, buildingID ) => {
	let buildingPosition = !!buildingID ? scene.getMeshByID(buildingID).position : vector3( scene.meshes.length+ 10,scene.meshes.length+ 10,scene.meshes.length+ 10 );
	return [...Array(qty).keys()].map( i => {
		
		let s = BABYLON.Mesh.CreateBox( uuid.v1(), 2, scene ); 
		s.position = vector3(0,200,0);//buildingPosition.add(vector3( /*!!buildingID ? 20 : */0, 100, /*!!buildingID ? 20 : */0 ) );
		addPhysicsProps(s, BABYLON.PhysicsImpostor.BoxImpostor, 100, 1, scene);
		s.material = scene.getMaterialByName('redMaterial');
		s.onSelect = (evt) => { s.material = scene.getMaterialByName('blackerMaterial') };
		s.onDeselect = (evt) => { s.material = scene.getMaterialByName('redMaterial') };
		s.type = type;
        s.class= 'CHARACTER';
		return s.id;
	} );
};