import BABYLON from 'babylonjs';
import uuid from 'uuid';
import { vector3 } from '../utils.js';
import { addPhysicsProps } from '../physics.js';

export const createGuy = ( scene, qty, type, buildingID ) => {
	let buildingPosition = !!buildingID ? scene.getMeshByID(buildingID).position.add(vector3(30,30,30)) : vector3( 30, 100, 30);
	return [...Array(qty).keys()].map( i => {
		
		let s = BABYLON.Mesh.CreateBox( uuid.v1(), 2, scene ); 
		s.position = buildingPosition;
		addPhysicsProps(s, BABYLON.PhysicsImpostor.BoxImpostor, 1, 0, 0.11, scene);
		s.standardMaterial = scene.getMaterialByName( type.material || 'yellowMaterial' );
		s.material = s.standardMaterial;
		s.onSelect = (evt) => { s.material = scene.getMaterialByName('selectionMaterial') };
		s.onDeselect = (evt) => { s.material = s.standardMaterial };
		s.type = type;
		return s.id;
	} );
};