import BABYLON from 'babylonjs';
import utils from './utils.js';
import uuid from 'uuid';
function initScene(){

	let canvas = document.getElementById( '3dview' );
	let engine = new BABYLON.Engine( canvas, true );
	
	let createScene = () => {
		let scene = new BABYLON.Scene( engine );
		scene.clearColor = new BABYLON.Color3(1, 0, 0);

		let camera = new BABYLON.FreeCamera( 'camera', utils.vector3(0,5,-10), scene );
		camera.setTarget( utils.vector3(0,0,0) );
		camera.attachControl( canvas, false );
		
		let light = new BABYLON.HemisphericLight( 'light', utils.vector3(0,0,0), scene );
		light.intensity = 5;


		let ground = BABYLON.Mesh.CreateGround("ground", 6, 6, 2, scene);
		ground.material = new BABYLON.StandardMaterial( 'texture1', scene );
		ground.material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
		
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

function createGuy( scene, number ){
	return [...Array(number).keys()].map( i => {
		let id = Math.random() * 1000
		let s = BABYLON.Mesh.CreateSphere(uuid.v1(), 16, 2, scene, false, ); 
		s.position.z = Math.random()*20;
		s.material = new BABYLON.StandardMaterial( 'texture'+Math.random(), scene );
		s.material.diffuseColor = new BABYLON.Color3(1.0, 0.2, 0.7);
		return s.id;
	} );
}
export default {
	initScene,
	createGuy,
};