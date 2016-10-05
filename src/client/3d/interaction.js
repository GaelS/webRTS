import BABYLON from 'babylonjs';
import monet, { Maybe } from 'monet';
import utils from './utils.js';
import actions from '../flux/actions.js';

function onPointerLeftUpEvent( event, dispatchEvents ){
	let mesh = event.pickInfo.pickedMesh;
	//store event
	!!mesh && mesh.name !== 'ground' ? dispatchEvents( actions.select( mesh.id ) ) : null;
	
	//display update
	return Maybe.fromNull( mesh )
		.bind(mesh => Maybe.fromNull( mesh.onSelect ) )
		//Execute action
		.orSome(utils.emptyFunc)();
}

function onPointerRightDownEvent( event, dispatchEvents ){
	//Get position on mesh clicked
	let mesh = event.pickInfo.pickedMesh;
	//Move the selected cube(s)
	return Maybe.fromNull( mesh ).isSome()? 
		dispatchEvents( actions.moveSelection( event.pickInfo.pickedPoint.x,  event.pickInfo.pickedPoint.z ) ):
		utils.emptyFunc();
}

function instantiateEvents(canvas, scene, dispatchEvents){
	
	scene.onPointerObservable.add((e) => {
		switch(e.event.type){
			case 'mousedown':
				let isLeft = e.event.buttons === 1 || e.event.button === 1; 
				let fn = isLeft ? onPointerLeftUpEvent : onPointerRightDownEvent;
				fn(e,dispatchEvents);
				break;
		}
		return;
	} );	
}

export default {
	instantiateEvents,
};