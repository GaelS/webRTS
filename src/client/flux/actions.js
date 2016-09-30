function initScene(){
	return {
		type : 'INIT',
		value : null,
	}
};

function createGuy( value ){
	return {
		type : 'CREATE_GUY',
		value,
	}
};

export default {
	initScene,
	createGuy,
};