import uuid from 'uuid';
import interaction from '../interaction.js';
import movement from '../movement.js';
import { vector3 } from '../utils.js';
import materialsLib from '../materials.js';
import cameraLib from '../camera/camera.js';
import * as characterTypes from '../../types/characters.js';
import { createBuilding } from './building.js';
import { createGuy } from './character.js';
import { updateUnderConstructionBuilding, deselectAll } from '../../flux/actions.js';

export default ( dispatchEvents ) => {
	let canvas = document.getElementById( '3dview' );
	let engine = new BABYLON.Engine( canvas, true );

	let createScene = ( dispatchEvents ) => {
		let scene = new BABYLON.Scene( engine );
		materialsLib.initMaterials(scene);
		scene.clearColor = new BABYLON.Color3(0, 0, 1);

        let light = new BABYLON.HemisphericLight("light1", vector3(0, 1, 0), scene);
        light.intensity = 1;

		let ground = BABYLON.Mesh.CreateGround("ground", 600, 600, 2, scene);
		ground.material = new BABYLON.StandardMaterial( 'texture1', scene );
		ground.material.diffuseColor = new BABYLON.Color3(0, 1, 0);
		
		let camera = cameraLib.createCamera( canvas, scene );
		interaction.instantiateEvents(canvas, scene, dispatchEvents);
		scene.dispatchEvents = dispatchEvents;
		//Shadow building instantiation
		createBuilding(scene, vector3(0,0,0), '', true);
		//First guy instantiation
		createGuy(scene, 1, characterTypes.CITIZEN.label);	
		return scene;	
	}
	let scene = createScene(dispatchEvents);
	scene.registerBeforeRender(() => {
		movement.updatePositions(scene);	

	} );
	engine.runRenderLoop( () => {
		scene.render();
	} );
	//update size of building in redux if buildings are under construction
	setInterval( () => dispatchEvents( updateUnderConstructionBuilding() ), 1000 );
	// Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
		//dispose and redraw canvas2D for rectangle selection
		if(!!scene.screenSpaceCanvas2D) scene.screenSpaceCanvas2D.dispose();
		engine.resize();
    } );
	return scene;
};