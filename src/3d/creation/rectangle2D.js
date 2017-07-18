import _ from 'lodash';
import BABYLON from 'babylonjs';

function createScreenSpaceCanvas2D(scene) {
  const { width, height } = document.getElementById('3dview');
  scene.screenSpaceCanvas2D = new BABYLON.ScreenSpaceCanvas2D(scene, {
    id: 'canvas2D',
    size: new BABYLON.Size(width, height),
    backgroundFill: '#00000000',
  });
}

function deleteScreenSpaceCanvas2D(scene) {
  if (!scene.screenSpaceCanvas2D) return;
  scene.screenSpaceCanvas2D.dispose();
  scene.screenSpaceCanvas2D = null;
}

function createSelectionRectangle(scene, startPosition, targetPosition) {
  //Return if nothing to draw
  if (_.isEqual(startPosition, targetPosition)) {
    return;
  }

  let [sourceX, sourceY] = startPosition;
  let [targetX, targetY] = targetPosition;
  //move from top left origin to bottom left origin
  //and remove device pixel ratio between DOM and canvas
  let { height: canvasHeight } = document.getElementById('3dview');
  let width = targetX - sourceX;
  let height = sourceY - targetY;

  //Create rectangle
  new BABYLON.Rectangle2D({
    id: 'rec',
    parent: scene.screenSpaceCanvas2D,
    x: sourceX,
    y: canvasHeight / window.devicePixelRatio - sourceY,
    height,
    width,
    border: BABYLON.Canvas2D.GetSolidColorBrushFromHex('#FFFFFFFF'),
    borderThickness: 2,
  });

  return {
    xmin: Math.min(sourceX, targetX),
    xmax: Math.max(sourceX, targetX),
    ymin: Math.min(sourceY, targetY),
    ymax: Math.max(sourceY, targetY),
  };
}
function deleteSelectionRectangle(scene) {
  //Delete previous rectangle
  if (!scene.screenSpaceCanvas2D) return;
  const prevRec = scene.screenSpaceCanvas2D.children[1];
  if (!!prevRec) {
    prevRec.dispose();
  }
}

export {
  createSelectionRectangle,
  deleteSelectionRectangle,
  createScreenSpaceCanvas2D,
  deleteScreenSpaceCanvas2D,
};
