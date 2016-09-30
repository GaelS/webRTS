import BABYLON from 'babylonjs';
import utils from './utils.js';
import uuid from 'uuid';
import interaction from './interaction.js';

function initScene(){

	let canvas = document.getElementById( '3dview' );
	let engine = new BABYLON.Engine( canvas, true );
	
	let createScene = () => {
		let scene = new BABYLON.Scene( engine );
		scene.clearColor = new BABYLON.Color3(0, 0, 1);

		let camera = new BABYLON.FreeCamera( 'camera', utils.vector3(0,5,-10), scene );
		camera.setTarget( utils.vector3(0,0,0) );
		camera.attachControl( canvas, false );
		
		let light = new BABYLON.HemisphericLight( 'light', utils.vector3(0,0,0), scene );
		light.intensity = 5;


		let ground = BABYLON.Mesh.CreateGround("ground", 600, 600, 2, scene);
		ground.material = new BABYLON.StandardMaterial( 'texture1', scene );
		ground.material.diffuseColor = new BABYLON.Color3(0, 1, 0);
		
		scene.onPointerDown = function (evt) {
            interaction.selectElement(evt);
        }
        scene.onPointerUp = function (evt) {
            console.log('up')
        }
        scene.onPointerMove = function (evt) {
            //console.log(evt)
        }

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
		let id = Math.random() * 1000;
		let s = BABYLON.Mesh.CreateBox(uuid.v1(), 2, scene, ); 
		s.position.z = Math.random()*20;
		s.material = new BABYLON.StandardMaterial( 'texture'+Math.random(), scene );
		s.material.diffuseColor = new BABYLON.Color3(1.0, 0.2, 0.7);
		s.select = (evt) => { console.log(s)};
		return s.id;
	} );
}
export default {
	initScene,
	createGuy,
};