import defaultState from './defaultState.js';
import R from 'ramda';
import creation from '../3d/creation.js';

export default ( ( state = defaultState, action ) => {
	let newState = R.clone(state);
	//scene cannot be cloned
	newState.scene = state.scene;
	switch(action.type){
		case 'INIT' :
			let scene = creation.initScene(action.value.startSelection,action.value.endSelection);
			newState.scene = scene;
			break;
		case 'CREATE_GUY' :
			newState.guys = [...state.guys,
			 ...creation.createGuy( newState.scene, action.value ) ];
		case 'START_SELECTION' :
			newState.selectedMesh = action.value;
	}
	return newState;
} );