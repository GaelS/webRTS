import * as characterTypes from '../types/characters.js';

function setTargetPosition( meshes, targetPos ){
		
	return meshes.forEach(e => { 
		e.targetPosition = targetPos;	
	} );
};

function updatePositions(scene){
	return scene.meshes.filter(e => !!e.targetPosition)
					.forEach(e => { 
						let speed = characterTypes[e.type].speed || 0.5;
						let dir = e.targetPosition.subtract( e.position );
						e.targetPosition = dir.length() >1 ? e.targetPosition : undefined;
						dir.normalize();
						e.position.x += dir.x *  speed;
						e.position.z += dir.z * speed;
					} );
}
export default {
	setTargetPosition,
	updatePositions,
};