import { updateMeshesPosition } from '../flux/actions.js';

// function setTargetPosition({meshes, targetPos, targetMeshID, scene }){
// 	let targetMesh = scene.getMeshByID( targetMeshID );
// 	return meshes.forEach( mesh => {
// 		if( !!targetMesh ) {
// 			addCallbackOnCollision( mesh, targetMesh, (main, collided) => {
// 				setVelocity( mesh, vector3( 0,0,0 ), 0 );
// 			} );
// 		} else {
// 			mesh.targetPosition = targetPos;
// 		}
// 		let speed = mesh.type.speed || 0.5;
// 		let dir = ( mesh.targetPosition || targetMesh.position ).subtract( mesh.position );
// 		dir.normalize();
// 		setVelocity( mesh, dir, speed );
// 	} );
// };

function updatePositions(scene) {
  scene.dispatchEvents(updateMeshesPosition());

  /*	return scene.meshes.filter(mesh => !!mesh.targetPosition)
					.forEach( mesh => { 
						let remainingPath = mesh.targetPosition.subtract( mesh.position );
						let isMovementDone = remainingPath.length() < 3;
						mesh.targetPosition =  !isMovementDone ? mesh.targetPosition : undefined;
						if(isMovementDone) setVelocity( mesh, vector3( 0,0,0 ), 0 );
					} ); */
}
export default {
  //setTargetPosition,
  updatePositions,
};
