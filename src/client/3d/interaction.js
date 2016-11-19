import utils from './utils.js';
import actions from '../flux/actions.js';
import creation from './creation.js';

function onPointerLeftUpEvent( event, dispatchEvents, scene ){
	let mesh = event.pickInfo.pickedMesh;
	let pos = event.pickInfo.pickedPoint;
	//store event
	let action = !!mesh && mesh.name !== 'ground' ? actions.select( mesh.id ) : actions.deselectAll();
	return dispatchEvents( action );
};

function onPointerRightUpEvent( event, dispatchEvents ){
	//Get position on mesh clicked
	let mesh = event.pickInfo.pickedMesh;
	//Move the selected cube(s) in not null
	return !!mesh ? 
		dispatchEvents( actions.moveSelection( event.pickInfo.pickedPoint.x,  event.pickInfo.pickedPoint.z ) )
		:
		utils.emptyFunc();
};

function onPointerDragEvent( e, startPoint, scene ){
	let save = startPoint;
	//Delete previous rectangle
	creation.deleteSelectionRectangle( scene );
	//Create new Rectangle
	creation.createSelectionRectangle( scene, startPoint, [ e.event.clientX, e.event.clientY ] );	
};

function instantiateEvents(canvas, scene, dispatchEvents){
	let startPoint = [0,0];

	scene.onPointerObservable.add((e) => {
		let isLeftClicked = e.event.which === 1; 
		let isRightClicked = e.event.which === 3; 
		let endDragging = startPoint[0] !== 0 && startPoint[1] !== 0;
		//For rectangle selection
		switch(e.event.type){
			case 'mouseup':
				(isLeftClicked ? onPointerLeftUpEvent : onPointerRightUpEvent)( e, dispatchEvents, scene );
				startPoint = [0,0];
				break;
			case 'mousedown' :
				startPoint =  [ e.event.clientX, e.event.clientY ];
				creation.createScreenSpaceCanvas2D(scene);
				onPointerDragEvent( e, startPoint, scene );
				break;
			case 'mousemove' :
				// selection rectangle is 
				//deleted here in case mouseup
				//is done outside canvas				
				if(!isLeftClicked){
					creation.deleteSelectionRectangle(scene);
					creation.deleteScreenSpaceCanvas2D(scene);
				} else {
					onPointerDragEvent( e, startPoint, scene );
				}
				break;
		}
		return;
	} );	
};

export default {
	instantiateEvents,
};