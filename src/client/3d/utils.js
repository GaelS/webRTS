import BABYLON from 'babylonjs';

function vector3(a,b,c){
	return new BABYLON.Vector3(a,b,c);
}
function emptyFunc(){
	console.log('empty func')
	return function(){return;};
}
export default {
	vector3,
	emptyFunc,
}