import defaultState from './defaultState.js';
import R from 'ramda';
import world from '../3d/world.js';

export default ( ( state = defaultState, action ) => {
	let newState = R.clone(state);
	//scene cannot be cloned
	newState.scene = state.scene;

	switch(action.type){
		case 'INIT' :
			let scene = world.initScene();
			newState.scene = scene;
			break;
		case 'CREATE_GUY' :
			newState.guys = [...state.guys,
			 ...world.createGuy( newState.scene, action.value ) ];
	}
	return newState;
} );