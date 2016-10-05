import defaultState from './defaultState.js';
import R from 'ramda';
import creation from '../3d/creation.js';
import movement from '../3d/movement.js';
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
			let meshes = newState.scene.meshes.filter(elt => newState.selectedMeshes.indexOf(elt.name) !== -1);
			movement.setTargetPosition(meshes, new BABYLON.Vector3(x, 0, z));
			break;
	}
	return newState;
} );