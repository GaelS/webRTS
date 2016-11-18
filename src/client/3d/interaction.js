import utils from './utils.js';
import actions from '../flux/actions.js';
import creation from './creation.js';

function onPointerLeftUpEvent( event, dispatchEvents ){
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
	let width = e.event.layerX - startPoint[0];
	let height = e.event.layerY - startPoint[1];
	creation.createSelectionRectangle( scene, startPoint, /*width, height*/ 100,100 );
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
				if(!endDragging) (isLeftClicked ? onPointerLeftUpEvent : onPointerRightUpEvent)( e,dispatchEvents );
				if(endDragging) startPoint = [0,0]; 
				break;
			case 'mousedown' :
				let window = document.getElementById('3dview');
				startPoint =  [ event.clientX, window.height - event.clientY ];
				console.log(startPoint)
				
				onPointerDragEvent( e, startPoint, scene );
				break;
			case 'mousemove' :
				//isLeftClicked && onPointerDragEvent( e, startPoint, scene );
				break;
		}
		return;
	} );	
};

export default {
	instantiateEvents,
};