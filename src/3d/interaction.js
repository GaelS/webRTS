import _ from 'lodash';
import { vector3, emptyFunc, checkPointInsidePolygon } from './utils.js';
import { select, deselectAll, setTarget, moveGhostBuilding } from '../flux/actions.js';
import { 
	createSelectionRectangle,
	deleteSelectionRectangle,
	deleteScreenSpaceCanvas2D,
	createScreenSpaceCanvas2D,
} from './creation/rectangle2D.js';
import {
	endBuildingCreation,
	resetShadowBuilding,
} from './creation/building.js';
import BABYLON from 'babylonjs';
import uuid from 'uuid';

function onPointerLeftUpEvent( scene, event, dispatchEvents, rectangleProps ){
	//action to dispatch to redux
	let action;
	if( !rectangleProps || rectangleProps.xmin === rectangleProps.xmax && rectangleProps.ymin === rectangleProps.ymax ){
		//Empty rectangle => classic selection
		let mesh = event.pickInfo.pickedMesh;
		let pos = event.pickInfo.pickedPoint;
		//store event
		action = !!mesh && !!mesh.type && !!mesh.type && mesh.type.selectable ? select( [ mesh.id ] ) : deselectAll();
	} else {
		//selection using rectangle selection
		//Rectangle ABCD starting from upper left
		let A = scene.pick(rectangleProps.xmin, rectangleProps.ymin).pickedPoint;
		let B = scene.pick(rectangleProps.xmax, rectangleProps.ymin).pickedPoint;
		let C = scene.pick(rectangleProps.xmax, rectangleProps.ymax).pickedPoint;
		let D = scene.pick(rectangleProps.xmin, rectangleProps.ymax).pickedPoint;

		let meshes = _.filter(scene.meshes, mesh => {
			//Filter if mesh is character class and
			//inside selection's rectangle
			return !!mesh.type && mesh.type.selectable && checkPointInsidePolygon( A, B, C, D, mesh.position ) } )
			.map( mesh => mesh.id); 

		action = meshes.length !== 0 ? select(meshes) : deselectAll();
	}	
		return dispatchEvents( action );
};

function onPointerRightUpEvent( scene, event, dispatchEvents ){
	//Return if right click when ghostBuilding displayed
	if( !!scene.getMeshByID( 'shadowBuilding' ).type ) return;
	//Get position on mesh clicked
	let mesh = event.pickInfo.pickedMesh;
	//Move the selected cube(s) if not null
	return !!mesh ? 
		dispatchEvents( setTarget( event.pickInfo.pickedPoint, !!mesh.type && mesh.type.class === 'BUILDING' ? mesh.id : null ) )
		:
		emptyFunc();
};

function onPointerDragEvent( e, startPoint, scene ){
	let save = startPoint;
	//Delete previous rectangle
	deleteSelectionRectangle( scene );
	//Create new Rectangle
	return createSelectionRectangle( scene, startPoint, [ e.event.clientX, e.event.clientY ] );	
};
function ghostBuildingManager( scene ){
	scene.onPointerObservable.add(e => { 
		let shadowMesh = scene.getMeshByID('shadowBuilding'); 
		switch(e.event.type){
			case 'pointermove':
			case 'mousemove':
				//set to visible if not
				//to display if directly on mouse cursor
				//and not at origin
				shadowMesh.visibility = 0.5;
				//only considering mousemove from ghost building
				scene.dispatchEvents( moveGhostBuilding( scene.pick(e.event.clientX, e.event.clientY).pickedPoint ) );
				break;
			case 'pointerup':
			case 'mouseup':
				let isLeftClicked = e.event.which === 1;
				let isRightClicked = e.event.which === 3;
				!!shadowMesh.type && isLeftClicked && endBuildingCreation(scene);
				!!shadowMesh.type && isRightClicked && resetShadowBuilding(scene);
				break;

		} 	
	} );
};
function endGhostBuildingManager( scene ){
	//Delete last observable which is the one 
	//for ghost building
	scene.onPointerObservable._observers.pop();
};

function instantiateEvents(canvas, scene, dispatchEvents){
	//Variable to keep props of selection rectangle
	let startPoint = [0,0];
	let selectionRectangleProps = null;
	scene.onPointerObservable.add((e) => {
		let isLeftClicked = e.event.which === 1 || e.event.buttons === 1; 
		let isRightClicked = e.event.which === 3 || e.event.buttons === 2;
		let endDragging = startPoint[0] !== 0 && startPoint[1] !== 0;
		//For rectangle selection
		switch(e.event.type){
			case 'pointerup' :
			case 'mouseup':
				(isLeftClicked ? onPointerLeftUpEvent : onPointerRightUpEvent)( scene, e, dispatchEvents, selectionRectangleProps );
				startPoint = [0,0];
				selectionRectangleProps = null;
				deleteSelectionRectangle(scene);
				deleteScreenSpaceCanvas2D(scene);
				break;
			case 'pointerdown' :
			case 'mousedown' :
				startPoint =  [ e.event.clientX, e.event.clientY ];
				createScreenSpaceCanvas2D(scene);
				onPointerDragEvent( e, startPoint, scene );
				break;
			case 'pointermove' :
			case 'mousemove' :
				// selection rectangle is 
				//automatically
				//deleted here in case mouseup
				//is done outside canvas	
				//with mousemove without left click			
				if(!isLeftClicked){
					deleteSelectionRectangle(scene);
					deleteScreenSpaceCanvas2D(scene);
				} else {
					selectionRectangleProps = onPointerDragEvent( e, startPoint, scene );
				}
				break;
		}
		return;
	} );	
};

export default {
	instantiateEvents,
	ghostBuildingManager,
	endGhostBuildingManager,
};