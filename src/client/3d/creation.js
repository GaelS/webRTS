import uuid from 'uuid';
import interaction from './interaction.js';
import movement from './movement.js';
import { vector3 } from './utils.js';
import materialsLib from './materials.js';
import cameraLib from './camera/camera.js';


function initScene( dispatchEvents ){
	let canvas = document.getElementById( '3dview' );
	let engine = new BABYLON.Engine( canvas, true );

	let createScene = ( dispatchEvents ) => {
		let scene = new BABYLON.Scene( engine );
		/*materialsLib.initMaterials(scene);
		scene.clearColor = new BABYLON.Color3(0, 0, 1);

        let light = new BABYLON.HemisphericLight("light1", vector3(0, 1, 0), scene);
        light.intensity = 1;

		let ground = BABYLON.Mesh.CreateGround("ground", 600, 600, 2, scene);
		ground.material = new BABYLON.StandardMaterial( 'texture1', scene );
		ground.material.diffuseColor = new BABYLON.Color3(0, 1, 0);
		*/
		let canvas = document.getElementById( '3dview' );
		//Step to manage different resolution 
		//to keep consistency between DOM and canvas pixel event
		canvas.width = canvas.width / window.devicePixelRatio;
		canvas.height = canvas.height / window.devicePixelRatio;
		
		let camera = cameraLib.createCamera( canvas, scene );
		interaction.instantiateEvents(canvas, scene, dispatchEvents);
		return scene;	
	}
	let scene = createScene(dispatchEvents);
	scene.screenSpaceCanvas2D = createScreenSpaceCanvas2D(scene);
	scene.registerBeforeRender(() => {
		movement.updatePositions(scene);
	} );
	engine.runRenderLoop( () => {
		scene.render();
	} );

	// Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
		//dispose and redraw canvas2D for rectangle selection
		scene.screenSpaceCanvas2D.dispose();
		scene.screenSpaceCanvas2D = createScreenSpaceCanvas2D(scene);
    	engine.resize();
    } );

	return scene;
};

function createScreenSpaceCanvas2D(scene){
	let window = document.getElementById('3dview');
	return new BABYLON.ScreenSpaceCanvas2D(scene, {
		id : 'canvas2D',
		size : new BABYLON.Size(window.width, window.height),
		backgroundFill: "#FFF0408F",
	} );
};

function createGuy( scene, number ){
	return [...Array(number).keys()].map( i => {
		
		let s = BABYLON.Mesh.CreateBox(uuid.v1(), 2, scene, ); 
		s.position.z = Math.random()*20;
		s.material = scene.getMaterialByName('redMaterial')
		s.onSelect = (evt) => { s.material = scene.getMaterialByName('blackerMaterial') };
		s.onDeselect = (evt) => { s.material = scene.getMaterialByName('redMaterial') };
		
		return s.id;
	} );
}

function createSelectionRectangle(scene, startPosition, width, height ){
	console.log(scene.screenSpaceCanvas2D.engine.getRenderWidth())
	return new BABYLON.Rectangle2D( {
		id : 'rec',
		parent : scene.screenSpaceCanvas2D,
		x : startPosition[0],
		y : startPosition[1],
		height,
		width,
		border : BABYLON.Canvas2D.GetSolidColorBrushFromHex("#FFFFFFFF"),
		borderThickness : 4,
	} );	
};
export default {
	initScene,
	createGuy,
	createSelectionRectangle,
};