import uuid from 'uuid';
import interaction from './interaction.js';
import movement from './movement.js';
import { vector3 } from './utils.js';
import materialsLib from './materials.js';
import cameraLib from './camera/camera.js';
import _ from 'lodash';
import { 
		creatingBuilding as creatingBuildingAction,
		buildingIsDone as buildingIsDoneAction, 
 	} from '../flux/actions.js';

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
		scene.dispatchEvents = dispatchEvents;
		//Shadow building instantiation
		createBuilding(scene, vector3(0,0,0), '', true);
		
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

function createGuy( scene, qty, type ){
	return [...Array(qty).keys()].map( i => {
		
		let s = BABYLON.Mesh.CreateBox( uuid.v1(), 2, scene ); 
		s.position.z = Math.random()*20;
		s.material = scene.getMaterialByName('redMaterial');
		s.onSelect = (evt) => { s.material = scene.getMaterialByName('blackerMaterial') };
		s.onDeselect = (evt) => { s.material = scene.getMaterialByName('redMaterial') };
		s.type = type;
		return s.id;
	} );
};
function startBuildingCreation(scene){
	//instantiating event for ghost building
	interaction.ghostBuildingManager(scene);
};

function endBuildingCreation(scene){
	let shadowMesh = scene.getMeshByID('shadowBuilding');
	let pos = shadowMesh.position;
	//Redux event
	scene.dispatchEvents( creatingBuildingAction(pos, 'house', false) );
	//set visibility back to 0
	shadowMesh.visibility = 0;
	//removing event for ghost building
	interaction.endGhostBuildingManager(scene);
};

function createBuilding( scene, position, type, shadow ){
	//Do not add shadow building if one is already created
	if( !!scene.getMeshByID( 'shadowBuilding' )  && shadow ) return; 
	let id = !shadow ? uuid.v1() : 'shadowBuilding';
	let s = BABYLON.Mesh.CreateBox( id, 20, scene ); 
	s.position = position;
	s.material = scene.getMaterialByName('yellowMaterial');
	s.onSelect = (evt) => { s.material = scene.getMaterialByName('blackerMaterial') };
	s.onDeselect = (evt) => { s.material = scene.getMaterialByName('greenMaterial') };
	s.type = type;
	s.isPickable = shadow ? false : true;
	s.visibility = !shadow ? 1 : 0;
	s.underConstruction = true;
	setTimeout(() => {
		s.underConstruction = false;
		s.material = scene.getMaterialByName('greenMaterial');
		scene.dispatchEvents( buildingIsDoneAction(s.id) );
	},3000);
	return s.id;
};

function createSelectionRectangle(scene, startPosition, targetPosition ){
	//HACK : clone to prevent strange behaviour
	//when point is modified (ref issue...)
	let point = _.clone(startPosition);

	//move from top left origin to bottom left origin
	//and remove device pixel ratio between DOM and canvas
	let canvas = document.getElementById('3dview');	
	let width = ( targetPosition[0] - point[0] ) * window.devicePixelRatio;
	let height = ( point[1] - targetPosition[1] ) * window.devicePixelRatio;
	point[1] = (canvas.height/window.devicePixelRatio - point[1]);	
	let rectangle = new BABYLON.Rectangle2D( {
		id : 'rec',
		parent : scene.screenSpaceCanvas2D,
		x : point[0] * window.devicePixelRatio,
		y : point[1] * window.devicePixelRatio,
		height,
		width,
		border : BABYLON.Canvas2D.GetSolidColorBrushFromHex('#FFFFFFFF'),
		borderThickness : 2,
	} );
	return {
		xmin : _.min( [startPosition[0],targetPosition[0] ] ),
		ymin : _.min( [startPosition[1],targetPosition[1] ] ),
		xmax : _.max( [startPosition[0],targetPosition[0] ] ),
		ymax : _.max( [startPosition[1],targetPosition[1] ] ),
	};
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
	startBuildingCreation,
	createBuilding,
	createSelectionRectangle,
	deleteSelectionRectangle,
	createScreenSpaceCanvas2D,
	deleteScreenSpaceCanvas2D,
	endBuildingCreation,
};