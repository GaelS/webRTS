import uuid from 'uuid';
import interaction from './interaction.js';
import movement from './movement.js';
import { vector3 } from './utils.js';
import materialsLib from './materials.js';
import cameraLib from './camera/camera.js';
import _ from 'lodash';

function initScene( dispatchEvents ){
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
		return scene;	
	}
	let scene = createScene(dispatchEvents);
	scene.registerBeforeRender(() => {
		movement.updatePositions(scene);
	} );
	engine.runRenderLoop( () => {
		scene.render();
	} );

	// Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
		//dispose and redraw canvas2D for rectangle selection
		if(!!scene.screenSpaceCanvas2D) scene.screenSpaceCanvas2D.dispose();
		engine.resize();
    } );

	return scene;
};

function createScreenSpaceCanvas2D(scene){
	//Step to manage different resolution 
	//to keep consistency between DOM and canvas pixel event
	let canvas = document.getElementById('3dview');
	scene.screenSpaceCanvas2D =  new BABYLON.ScreenSpaceCanvas2D(scene, {
		id : 'canvas2D',
		size : new BABYLON.Size(canvas.width, canvas.height),
		backgroundFill: '#00000000',
	} );
};

function deleteScreenSpaceCanvas2D(scene){
	if(!scene.screenSpaceCanvas2D) return;
	scene.screenSpaceCanvas2D.dispose();
	scene.screenSpaceCanvas2D = null;
}

function createGuy( scene, number ){
	return [...Array(number).keys()].map( i => {
		
		let s = BABYLON.Mesh.CreateBox( uuid.v1(), 2, scene ); 
		s.position.z = Math.random()*20;
		s.material = scene.getMaterialByName('redMaterial');
		s.onSelect = (evt) => { s.material = scene.getMaterialByName('blackerMaterial') };
		s.onDeselect = (evt) => { s.material = scene.getMaterialByName('redMaterial') };
		return s.id;
	} );
}

function createSelectionRectangle(scene, startPosition, targetPosition ){
	let canvas = document.getElementById('3dview');
	//move from top left origin to bottom left origin
	//and remove device pixel ratio between DOM and canvas
	
	//HACK : clone to prevent strange behaviour
	//when point is modified (ref issue...)
	let point = _.clone(startPosition);
	
	let width = ( targetPosition[0] - point[0] ) * window.devicePixelRatio;
	let height = ( point[1] - targetPosition[1] ) * window.devicePixelRatio;
	point[1] = (canvas.height/window.devicePixelRatio - point[1]);	
	return new BABYLON.Rectangle2D( {
		id : 'rec',
		parent : scene.screenSpaceCanvas2D,
		x : point[0] * window.devicePixelRatio,
		y : point[1] * window.devicePixelRatio,
		height,
		width,
		border : BABYLON.Canvas2D.GetSolidColorBrushFromHex('#FFFFFFFF'),
		borderThickness : 2,
	} );
};
function deleteSelectionRectangle(scene){
	//Delete previous rectangle
	if(!scene.screenSpaceCanvas2D) return;
	let prevRec = scene.screenSpaceCanvas2D.children[1];
	if(!!prevRec) prevRec.dispose();
};

export default {
	initScene,
	createGuy,
	createSelectionRectangle,
	deleteSelectionRectangle,
	createScreenSpaceCanvas2D,
	deleteScreenSpaceCanvas2D,
};