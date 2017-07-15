import _ from 'lodash';
import BABYLON from 'babylonjs';

export const createScreenSpaceCanvas2D = (scene) => {
	//Step to manage different resolution 
	//to keep consistency between DOM and canvas pixel event
	let canvas = document.getElementById('3dview');
	scene.screenSpaceCanvas2D =  new BABYLON.ScreenSpaceCanvas2D(scene, {
		id : 'canvas2D',
		size : new BABYLON.Size(canvas.width, canvas.height),
		backgroundFill: '#00000000',
	} );
};

export const deleteScreenSpaceCanvas2D = (scene) => {
	if(!scene.screenSpaceCanvas2D) return;
	scene.screenSpaceCanvas2D.dispose();
	scene.screenSpaceCanvas2D = null;
}

export const createSelectionRectangle = (scene, startPosition, targetPosition ) => {
	//Return if nothing to draw
	if( _.isEqual(startPosition, targetPosition) ) return;
	
	//HACK : clone to prevent strange behaviour
	//when point is modified (ref issue...)
	let point = _.clone(startPosition);

	//move from top left origin to bottom left origin
	//and remove device pixel ratio between DOM and canvas
	let canvas = document.getElementById('3dview');	
	let width = ( targetPosition[0] - point[0] );
	let height = ( point[1] - targetPosition[1] );
	point[1] = (canvas.height/window.devicePixelRatio - startPosition[1]);	
	let rectangle = new BABYLON.Rectangle2D( {
		id : 'rec',
		parent : scene.screenSpaceCanvas2D,
		x : point[0],
		y : point[1],
		height,
		width,
		border : BABYLON.Canvas2D.GetSolidColorBrushFromHex('#FFFFFFFF'),
		borderThickness : 2,
	} );
	return {
		xmin : _.min( [ startPosition[0], targetPosition[0] ] ),
		ymin : _.min( [ startPosition[1], targetPosition[1] ] ),
		xmax : _.max( [ startPosition[0], targetPosition[0] ] ),
		ymax : _.max( [ startPosition[1], targetPosition[1] ] ),
	};
};
export const deleteSelectionRectangle = (scene) => {
	//Delete previous rectangle
	if(!scene.screenSpaceCanvas2D) return;
	let prevRec = scene.screenSpaceCanvas2D.children[1];
	if(!!prevRec) prevRec.dispose();
};
export default {
	createSelectionRectangle,
	deleteSelectionRectangle,
	createScreenSpaceCanvas2D,
	deleteScreenSpaceCanvas2D,
};