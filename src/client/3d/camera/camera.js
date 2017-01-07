import { degToRad, vector3 } from '../utils.js';
import CustomInputs from './customInputs.js';
 

let initCameraSettings = (camera) => {
	//block rotation on x axis 
	camera.upperAlphaLimit = 0;
    camera.lowerAlphaLimit = 0;
	//block rotation on y axis 
	camera.upperBetaLimit = degToRad(25);
    camera.lowerBetaLimit = degToRad(25);
	//limit zoom in/out
	camera.lowerRadiusLimit = 10;
	camera.upperRadiusLimit = 500;
	camera.setTarget(vector3(0,0,0));
};
let mouseEvents = (camera) => {
	return (eventData,eventState) => {
		let mouseWheel = eventData.type === 8;
		if(!mouseWheel) return;
		let sign = eventData.event.wheelDelta < 0 ? 5 : -5;
		let displacement = camera.position.add(camera.upVector.multiplyByFloats(sign, sign, sign));
		camera.setPosition(displacement);
	} 
}
let initCameraEvents = (camera, scene) => {
	//Remove all preset control 
	camera.inputs.clear();
	//mouse input
	scene.onPointerObservable.add(mouseEvents(camera));
	//keyboard input
	camera.inputs.add(new CustomInputs(camera));
};

export default {
	createCamera : function(canvas, scene) {	
		let camera = new BABYLON.ArcRotateCamera("camera", 1, 0.8, 10, BABYLON.Vector3.Zero(), scene);
		initCameraSettings(camera);	
		initCameraEvents(camera, scene);
		camera.attachControl( canvas, false );
		camera.setPosition(vector3(80, 100, 80));
		return camera;
	},
};