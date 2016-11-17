import { degToRad, vector3 } from './utils.js';
import CustomInputs from './CustomInputs.js';
 

let initCameraSettings = (camera) => {
	//block rotation on x axis 
	camera.upperAlphaLimit = 0;
    camera.lowerAlphaLimit = 0;
	//block rotation on y axis 
	camera.upperBetaLimit = degToRad(25);
    camera.lowerBetaLimit = degToRad(25);
	//limit zoom in/out
	camera.lowerRadiusLimit = 10;
	camera.upperRadiusLimit = 200;
	camera.setTarget(vector3(0,0,0));
};
let keyboardEvents = (camera) => {
	return pi => {
		//console.log(pi);
	} 
}
let initCameraEvents = (camera, scene) => {
	//Remove all preset control 
	camera.inputs.clear();
	scene.onPointerObservable.add(keyboardEvents(camera));
	camera.inputs.add(new CustomInputs(camera));
};

export default {
	createCamera : function(canvas, scene) {	
		let camera = new BABYLON.ArcRotateCamera("camera", 1, 0.8, 10, BABYLON.Vector3.Zero(), scene);
		initCameraSettings(camera);	
		initCameraEvents(camera, scene);
		
		camera.attachControl( canvas, false );
		camera.setPosition(new BABYLON.Vector3(0, 50, -30));
		return camera;
	},
};