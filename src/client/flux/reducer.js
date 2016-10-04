import defaultState from './defaultState.js';
import R from 'ramda';
import creation from '../3d/creation.js';

export default ( ( state = defaultState, action ) => {
	let newState = R.clone(state);
	let value = action.value;
	//scene cannot be cloned
	newState.scene = state.scene;
	switch(action.type){
		case 'INIT' :
			let scene = creation.initScene(
				value.startSelection,
				value.endSelection,
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
	}
	return newState;
} );