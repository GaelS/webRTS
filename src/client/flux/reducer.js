import defaultState from './defaultState.js';
import R from 'ramda';
import creation from '../3d/creation.js';
import BABYLON from 'babylonjs';

export default ( ( state = defaultState, action ) => {
	let newState = R.clone(state);
	let value = action.value;
	//scene cannot be cloned
	newState.scene = state.scene;
	switch(action.type){
		case 'INIT' :
			let scene = creation.initScene(
				value.dispatchEvents,
			);
			newState.scene = scene;
			break;
		case 'CREATE_GUY' :
			newState.guys = [...state.guys,
			 ...creation.createGuy( newState.scene, value ) ];
			 break;
		case 'START_SELECTION' :
			newState.selectedMeshes = [...newState.selectedMeshes, value];
			break;
		case 'MOVE_SELECTION' : 
			let {x,z} = action.value;
			newState.scene.meshes.filter(elt => newState.selectedMeshes.indexOf(elt.name) !== -1)
			.forEach(e => e.targetPosition = new BABYLON.Vector3(x, 0, z) );

			newState.scene.registerBeforeRender(() => {
				state.scene.meshes.filter(e => !!e.targetPosition)
					.forEach(e => { 
						let dir = e.targetPosition.subtractInPlace( e.position ).normalize();
						console.log(dir)
						e.position.x += dir.x *  0.5;
						e.position.z += dir.z * 0.5;
						if(Math.abs(e.position.x - e.targetPosition.x) < 1 && Math.abs(e.position.z - e.targetPosition.z) < 1 ){
							e.targetPosition = undefined;
						}
					} )
	} );
	}
	return newState;
} );