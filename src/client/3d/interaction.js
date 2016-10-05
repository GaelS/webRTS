import BABYLON from 'babylonjs';
import monet, { Maybe } from 'monet';
import utils from './utils.js';
import actions from '../flux/actions.js';

function onPointerLeftUpEvent( event, dispatchEvents ){
	let mesh = event.pickInfo.pickedMesh;
	//store event
	let action = !!mesh && mesh.name !== 'ground' ? actions.select( mesh.id ) : actions.deselectAll();
	return dispatchEvents( action );
};

function onPointerRightUpEvent( event, dispatchEvents ){
	//Get position on mesh clicked
	let mesh = event.pickInfo.pickedMesh;
	//Move the selected cube(s)
	return Maybe.fromNull( mesh ).isSome()? 
		dispatchEvents( actions.moveSelection( event.pickInfo.pickedPoint.x,  event.pickInfo.pickedPoint.z ) ):
		utils.emptyFunc();
};

function instantiateEvents(canvas, scene, dispatchEvents){
	
	scene.onPointerObservable.add((e) => {
		let isLeftClicked = e.event.which === 1; 
		let isRightClicked = e.event.which === 3; 
		
		switch(e.event.type){
			case 'mouseup':
				let fn = isLeftClicked ? onPointerLeftUpEvent : onPointerRightUpEvent;
				fn(e,dispatchEvents);
				break;
			case 'mousemove' :
				break;
		}
		return;
	} );	
};

export default {
	instantiateEvents,
};