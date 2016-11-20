import uuid from 'uuid';
import { vector3 } from '../utils.js';

export const createGuy = ( scene, qty, type, buildingID ) => {
	let buildingPosition = !!buildingID ? scene.getMeshByID(buildingID).position : vector3( 0,0,0 );
	return [...Array(qty).keys()].map( i => {
		
		let s = BABYLON.Mesh.CreateBox( uuid.v1(), 2, scene ); 
		s.position = buildingPosition.add(vector3( !!buildingID ? 10 : 0, 0, 0 ) );
		s.material = scene.getMaterialByName('redMaterial');
		s.onSelect = (evt) => { s.material = scene.getMaterialByName('blackerMaterial') };
		s.onDeselect = (evt) => { s.material = scene.getMaterialByName('redMaterial') };
		s.type = type;
        s.class= 'CHARACTER';
		return s.id;
	} );
};