import BABYLON from 'babylonjs';
import monet, { Maybe } from 'monet';
import utils from './utils.js';

function onPointerDownEvent(scene){
		//Get select function from selected Mesh
		let action = Maybe.Some(
						scene.pick(scene.pointerX, scene.pointerY).pickedMesh
					)
					.bind(mesh => !!mesh.onSelect ? Maybe.Some(mesh.onSelect) : Maybe.None())
					//Execute action
					.orSome(utils.emptyFunc)();
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
		console.log('move')
		let pickPoint = scene.pick(scene.pointerX, scene.pointerY);
		
		if(!pickPoint.hit) return;
		let pickedMesh = pickPoint.pickedMesh;
		if(!!pickedMesh.onDeselect){
			pickedMesh.onDeselect();
		}	
	} );
}


function instantiateEvents(canvas, scene, startSelection, endSelection){
	
	scene.onPointerObservable.add((e) => {
		switch(e.event.type){
			case 'mousedown' :
				onPointerDownEvent(scene);
				break;
		}
		return;
	} );	
}

export default {
	instantiateEvents,
}