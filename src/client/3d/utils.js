import BABYLON from 'babylonjs';

function vector3(a,b,c){
	return new BABYLON.Vector3(a,b,c);
}

export default {
	vector3 : vector3,
}