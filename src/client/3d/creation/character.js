import uuid from 'uuid';

export const createGuy = ( scene, qty, type ) => {
	return [...Array(qty).keys()].map( i => {
		
		let s = BABYLON.Mesh.CreateBox( uuid.v1(), 2, scene ); 
		s.position.z = Math.random()*20;
		s.material = scene.getMaterialByName('redMaterial');
		s.onSelect = (evt) => { s.material = scene.getMaterialByName('blackerMaterial') };
		s.onDeselect = (evt) => { s.material = scene.getMaterialByName('redMaterial') };
		s.type = type;
		return s.id;
	} );
};