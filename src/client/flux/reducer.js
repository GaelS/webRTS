import defaultState from './defaultState.js';

import creation from '../3d/creation.js';
import interaction from '../3d/interaction.js'
import movement from '../3d/movement.js';
import materials from '../3d/materials.js';

import R from 'ramda';

import BABYLON from 'babylonjs';

export default ( ( state = defaultState, action ) => {
	
	let newState = R.clone( R.omit('scene',state ) );
	//scene cannot be cloned
	newState.scene = state.scene;
	
	let value = action.value;
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
			//Reset already selected meshes
			materials.deselectMeshes( newState.scene, newState.selectedMeshes );
			materials.selectMeshes( newState.scene, value );
			newState.selectedMeshes = Array.isArray(value) ? value : [ value ];
			break;
		case 'DESELECT_ALL' :
			materials.deselectMeshes(newState.scene, newState.selectedMeshes);
			newState.selectedMeshes = [];
			break;
		case 'MOVE_SELECTION' : 
			let {x,z} = action.value;
			let meshes = newState.scene.meshes.filter(elt => newState.selectedMeshes.indexOf(elt.name) !== -1);
			movement.setTargetPosition(meshes, new BABYLON.Vector3(x, 0, z));
			break;
	}
	return newState;
} );