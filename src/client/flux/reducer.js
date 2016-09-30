import defaultState from './defaultState.js';
import R from 'ramda';
import world from '../3d/world.js';

export default ( ( state = defaultState, action ) => {
	let newState = R.clone(state);
	
	switch(action.type){
		case 'INIT' :
			let scene = world.initScene();
			state.scene = scene;
			break;
	}
	return newState;
} );