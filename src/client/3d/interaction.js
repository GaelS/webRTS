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

function onPointerLeftDownEvent( event, dispatchEvents , scene ){	/*
		var canvas = new BABYLON.ScreenSpaceCanvas2D(scene, 
	    { 
	        id: "ScreenCanvas", size: new BABYLON.Size(600, 500), 
	        backgroundFill: "#C0C0C040", backgroundRoundRadius: 50 
	    });
	
	var rect = new BABYLON.Rectangle2D({
	    id: "mainRect", parent: canvas, x: 200, y: 200, width: 100, height: 100, 
	    fill: "#404080FF", border: "#A040A0D0, #FFFFFFFF", borderThickness: 10, 
	    roundRadius: 10, 
	    children: 
	    [
	        new BABYLON.Rectangle2D(
	        { 
	            id: "insideRect", marginAlignment: "v: center, h: center", 
	            width: 40, height: 40, fill: "#FAFF75FF", roundRadius: 10 
	        })
	    ]});

	scene.activeCamera.attachControl(canvas, false);
	window.setTimeout(() =>{
		canvas.isVisible = false;
		canvas.levelVisible = false;
	}, 1000) */
}
function instantiateEvents(canvas, scene, dispatchEvents){
	
	scene.onPointerObservable.add((e) => {
		let isLeftClicked = e.event.which === 1; 
		let isRightClicked = e.event.which === 3; 
		
		switch(e.event.type){
			case 'mouseup':
				let fn = isLeftClicked ? onPointerLeftUpEvent : onPointerRightUpEvent;
				fn(e,dispatchEvents);
				break;
			case 'mousedown' :
				//onPointerLeftDownEvent(e, dispatchEvents,scene);
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