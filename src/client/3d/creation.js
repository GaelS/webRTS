import BABYLON from 'babylonjs';
import uuid from 'uuid';
import interaction from './interaction.js';
import utils from './utils.js';
import materialsLib from './materials.js';
import cameraLib from './camera.js';


function initScene(startSelection, endSelection){

	let canvas = document.getElementById( '3dview' );
	let engine = new BABYLON.Engine( canvas, true );

	let createScene = (startSelection, endSelection) => {
		let scene = new BABYLON.Scene( engine );
		materialsLib.initMaterials(scene);
		scene.clearColor = new BABYLON.Color3(0, 0, 1);

        let light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 1;


		let ground = BABYLON.Mesh.CreateGround("ground", 600, 600, 2, scene);
		ground.material = new BABYLON.StandardMaterial( 'texture1', scene );
		ground.material.diffuseColor = new BABYLON.Color3(0, 1, 0);
		
		let canvas = document.getElementById( '3dview' );
		let camera = cameraLib.createCamera( canvas, scene );
		
		interaction.instantiateEvents(canvas, scene, startSelection, endSelection);
		
		return scene;	
	}

	let scene = createScene(startSelection, endSelection);

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
		
		let s = BABYLON.Mesh.CreateBox(uuid.v1(), 2, scene, ); 
		s.position.z = Math.random()*20;
		s.material = new BABYLON.StandardMaterial( 'texture'+Math.random(), scene );
		s.material.diffuseColor = new BABYLON.Color3(1.0, 0.2, 0.7);
		s.onSelect = (evt) => { console.log('s',s.id); s.material = scene.getMaterialByName('blackerMaterial') };
		s.onDeselect = (evt) => { console.log('des',s.id)};
		
		return s.id;
	} );
}
export default {
	initScene,
	createGuy,
};