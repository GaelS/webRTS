import BABYLON from 'babylonjs';
import utils from './utils.js';

function createCamera(canvas, scene){
	
	let camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 10, BABYLON.Vector3.Zero(), scene);
	camera.attachControl( canvas, false );
	camera.setPosition(new BABYLON.Vector3(0, 15, -30));

	return camera
};

export default{
	createCamera,
};