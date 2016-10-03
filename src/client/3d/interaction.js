import BABYLON from 'babylonjs';
import monet, { Maybe } from 'monet';
import utils from './utils.js';

function onPointerDownEvent(canvas, scene, startSelection){
	canvas.addEventListener('mousedown', (evt) => {
		//Get select function from selected Mesh
		let action = Maybe.Some(
						scene.pick(scene.pointerX, scene.pointerY).pickedMesh
					)
					.bind(mesh => !!mesh.onSelect ? Maybe.Some(mesh.onSelect) : Maybe.None())
					//Execute action
					.orSome(utils.emptyFunc)();
	} );
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
	onPointerDownEvent(canvas, scene, startSelection);
	//onPointerUpEvent(canvas, scene);
	onPointerMoveEvent(canvas, scene);
}

export default {
	instantiateEvents,
}