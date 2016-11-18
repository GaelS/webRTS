import utils from './utils.js';
import actions from '../flux/actions.js';
import creation from './creation.js';

function onPointerLeftUpEvent( event, dispatchEvents, scene ){
	//Delete previous rectangle
	creation.deleteSelectionRectangle( scene );
	let mesh = event.pickInfo.pickedMesh;
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
	let window = document.getElementById('3dview');
	let width = e.event.clientX - startPoint[0];
	let height = window.height - e.event.clientY - startPoint[1];
	//Delete previous rectangle
	creation.deleteSelectionRectangle( scene );
	//Create new Rectangle
	creation.createSelectionRectangle( scene, startPoint, width, height );
};

function instantiateEvents(canvas, scene, dispatchEvents){
	let startPoint = [0,0];
	let windowEventActivated = false;
	
	
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
				let window = document.getElementById('3dview');
				startPoint =  [ event.clientX, window.height - event.clientY ];
				onPointerDragEvent( e, startPoint, scene );
				break;
			case 'mousemove' :
				// selection rectangle is 
				//deleted here in case mouseup
				//is done outside canvas				
				creation.deleteSelectionRectangle(scene);
				isLeftClicked && onPointerDragEvent( e, startPoint, scene );
				break;
		}
		return;
	} );	
};

export default {
	instantiateEvents,
};