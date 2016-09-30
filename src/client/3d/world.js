import BABYLON from 'babylonjs';
import utils from './utils.js';

function initScene(){

	let canvas = document.getElementById( '3dview' );
	let engine = new BABYLON.Engine( canvas, true );
	
	let createScene = () => {
		let scene = new BABYLON.Scene( engine );
		scene.clearColor = new BABYLON.Color3(1, 1, 0);

		let camera = new BABYLON.FreeCamera( 'camera', utils.vector3(0,5,-10), scene );
		camera.setTarget( utils.vector3(0,0,0) );
		camera.attachControl( canvas, false );
		
		let light = new BABYLON.HemisphericLight( 'light', utils.vector3(0,0,0), scene );
		light.intensity = 5;


		let ground = BABYLON.Mesh.CreateGround("ground", 6, 6, 2, scene);
		let sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
		sphere.position.y = 1;
		return scene;	
	}

	let scene = createScene();
	engine.runRenderLoop( () => {
		scene.render();
	} );

	// Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
    	engine.resize();
    } );

	return scene;
}

export default {
	initScene
};