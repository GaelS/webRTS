function initScene(startSelection, endSelection){
	return {
		type : 'INIT',
		value : {
			startSelection,
			endSelection,
		},
	}
};

function createGuy( value ){
	return {
		type : 'CREATE_GUY',
		value,
	}
};

function startSelection(idMesh){
	return {
		type : 'START_SELECTION',
		value : idMesh,
	}
};

export default {
	initScene,
	createGuy,
	startSelection,
};