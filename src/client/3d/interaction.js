import BABYLON from 'babylonjs';
import monet, { Maybe } from 'monet';
import utils from './utils.js';

function onPointerLeftDownEvent(scene,event,startSelection){
	let mesh = event.pickInfo.pickedMesh;
	//store event
	startSelection(mesh.id)	;
	//display update
	return Maybe.Some( mesh )
		.bind(mesh => !!mesh.onSelect ? Maybe.Some(mesh.onSelect) : Maybe.None())
		//Execute action
		.orSome(utils.emptyFunc)();
}

function onPointerRightDownEvent(scene,event){
	//Get position on mesh clicked
	//Move the selected cube(s)
	console.log('ok');
}

/*function onPointerUpEvent(canvas,scene){
	canvas.addEventListener('mouseup', (evt) => {
		let pickPoint = scene.pick(scene.pointerX, scene.pointerY);
		
		if(!pickPoint.hit) return;
		let pickedMesh = pickPoint.pickedMesh;
		if(!!pickedMesh.onDeselect){
			pickedMesh.onDeselect();
		}	
	} );
}*/

function onPointerMoveEvent(canvas,scene){
	canvas.addEventListener('mousemove', (evt) => {
		if(evt.buttons !== 1) return;
		let pickPoint = scene.pick(scene.pointerX, scene.pointerY);
		
		if(!pickPoint.hit) return;
		let pickedMesh = pickPoint.pickedMesh;
		if(!!pickedMesh.onDeselect){
			pickedMesh.onDeselect();
		}	
	} );
}


function instantiateEvents(canvas, scene, startSelection){
	
	scene.onPointerObservable.add((e) => {
		switch(e.event.type){
			case 'mousedown' :
				let isLeft = e.event.buttons === 1 || e.event.button === 1; 
				 isLeft ? onPointerLeftDownEvent(scene, e, startSelection) : onPointerRightDownEvent(scene, e, selectedMeshes);
				break;
		}
		return;
	} );	
}

export default {
	instantiateEvents,
}