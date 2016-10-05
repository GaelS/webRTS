function setTargetPosition(meshes, targetPos){
	return meshes.forEach(e => e.targetPosition = targetPos );
};

function updatePositions(scene){
	return scene.meshes.filter(e => !!e.targetPosition)
					.forEach(e => { 
						let dir = e.targetPosition.subtract( e.position );
						e.targetPosition = dir.length() <1 ? undefined : e.targetPosition;
						dir.normalize();
						e.position.x += dir.x *  0.5;
						e.position.z += dir.z * 0.5;
					} );
}
export default {
	setTargetPosition,
	updatePositions,
};