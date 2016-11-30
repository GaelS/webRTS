import * as characterTypes from '../types/characters.js';
import { vector3 } from './utils.js';
import { setVelocity, addCallbackOnCollision, changePhysicsOptions } from './physics.js';

function setTargetPosition( meshes, targetPos, targetMeshID, scene ){
	let targetMesh = scene.getMeshByID( targetMeshID );
	return meshes.forEach( mesh => { 
		if( !!targetMesh ) {
			addCallbackOnCollision( mesh, targetMesh, (main, collided) => {
				console.log('collision');
				setVelocity( mesh, vector3( 0,0,0 ), 0 );
			} );
		} else {
			mesh.targetPosition = targetPos;
		}
		let speed = characterTypes[ mesh.type ].speed || 0.5;
		let dir = ( mesh.targetPosition || targetMesh.position ).subtract( mesh.position );
		dir.normalize();
		setVelocity( mesh, dir, speed );
	} );
};

function updatePositions(scene){
	return scene.meshes.filter(mesh => !!mesh.targetPosition)
					.forEach( mesh => { 
						let remainingPath = mesh.targetPosition.subtract( mesh.position );
						let isMovementDone = remainingPath.length() < 3;
						mesh.targetPosition =  !isMovementDone ? mesh.targetPosition : undefined;
						if(isMovementDone) setVelocity( mesh, vector3( 0,0,0 ), 0 );
					} );
}
export default {
	setTargetPosition,
	updatePositions,
};