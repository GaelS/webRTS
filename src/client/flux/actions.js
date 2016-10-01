function initScene(startSelection, endSelection){
	return {
		type : 'INIT',
		value : {
			startSelection,
			endSelection
		},
	}
};

function createGuy( value ){
	return {
		type : 'CREATE_GUY',
		value,
	}
};

function startSelection(value){
	console.log('ici')
	return {
		type : 'START_SELECTION',
		value,
	}
};

export default {
	initScene,
	createGuy,
	startSelection,
};