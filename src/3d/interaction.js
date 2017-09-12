import _ from 'lodash';
import { checkPointInsidePolygon } from './utils.js';
import {
  select,
  deselectAll,
  setTarget,
  moveGhostBuilding,
} from '../flux/actions.js';
import {
  createSelectionRectangle,
  deleteSelectionRectangle,
  deleteScreenSpaceCanvas2D,
  createScreenSpaceCanvas2D,
} from './creation/rectangle2D.js';
import {
  endBuildingCreation,
  resetShadowBuilding,
} from './creation/building.js';

function onPointerLeftUpEvent({
  scene,
  event,
  dispatchEvents,
  rectangleProps,
}) {
  //	rectangleProps = rectangleProps || {};
  //action to dispatch to redux
  let action;
  const { xmin, xmax, ymin, ymax } = rectangleProps || {};
  if (xmin === xmax && ymin === ymax) {
    //Empty rectangle => classic selection
    let mesh = event.pickInfo.pickedMesh;
    //store event
    const { selectable } = mesh.type || {};
    action = mesh && selectable ? select([mesh.id]) : deselectAll();
  } else {
    //selection using rectangle selection
    //Rectangle ABCD starting from upper left
    let A = scene.pick(xmin, ymin).pickedPoint;
    let B = scene.pick(xmax, ymin).pickedPoint;
    let C = scene.pick(xmax, ymax).pickedPoint;
    let D = scene.pick(xmin, ymax).pickedPoint;

    let meshes = _.filter(scene.meshes, mesh => {
      //Filter if mesh is character class and
      //inside selection's rectangle
      return (
        !!mesh.type &&
        mesh.type.selectable &&
        checkPointInsidePolygon(A, B, C, D, mesh.position)
      );
    }).map(mesh => mesh.id);

    action = meshes.length !== 0 ? select(meshes) : deselectAll();
  }
  return dispatchEvents(action);
}

function onPointerRightUpEvent({ scene, event, dispatchEvents }) {
  //Return if right click when ghostBuilding displayed
  if (!!scene.getMeshByID('shadowBuilding').type) return;
  //Get position on mesh clicked
  let {pickedMesh: mesh, pickedPoint} = event.pickInfo;
  //Move the selected cube(s) if not null
  return !!mesh
    ? dispatchEvents(
        setTarget(
          pickedPoint,
          !!mesh.type && mesh.type.targetable ? mesh.id : null
        )
      )
    : _.noop();
}

function onPointerDragEvent(event, startPoint, scene) {
  //Delete previous rectangle
  deleteSelectionRectangle(scene);
  //Create new Rectangle
  return createSelectionRectangle(scene, startPoint, [
    event.event.clientX,
    event.event.clientY,
  ]);
}
function ghostBuildingManager(scene) {
  scene.onPointerObservable.add(e => {
    let shadowMesh = scene.getMeshByID('shadowBuilding');
    switch (e.event.type) {
      case 'pointermove':
      case 'mousemove':
        //set to visible if not
        //to display if directly on mouse cursor
        //and not at origin
        shadowMesh.visibility = 0.5;
        //only considering mousemove from ghost building
        scene.dispatchEvents(
          moveGhostBuilding(
            scene.pick(e.event.clientX, e.event.clientY).pickedPoint
          )
        );
        break;
      case 'pointerup':
      case 'mouseup':
        let isLeftClicked = e.event.which === 1;
        let isRightClicked = e.event.which === 3;
        !!shadowMesh.type && isLeftClicked && endBuildingCreation(scene);
        !!shadowMesh.type && isRightClicked && resetShadowBuilding(scene);
        break;
      default:
        break;
    }
  });
}
function endGhostBuildingManager(scene) {
  //Delete last observable which is the one
  //for ghost building
  scene.onPointerObservable._observers.pop();
}

function instantiateEvents(canvas, scene, dispatchEvents) {
  //Variable to keep props of selection rectangle
  let startPoint = [0, 0];
  let rectangleProps = null;
  scene.onPointerObservable.add(event => {
    let isLeftClicked = event.event.which === 1 || event.event.buttons === 1;
    //For rectangle selection
    switch (event.event.type) {
      case 'pointerup':
      case 'mouseup':
        (isLeftClicked ? onPointerLeftUpEvent : onPointerRightUpEvent)({
          scene,
          event,
          dispatchEvents,
          rectangleProps,
        });
        startPoint = [0, 0];
        rectangleProps = null;
        deleteSelectionRectangle(scene);
        deleteScreenSpaceCanvas2D(scene);
        break;
      case 'pointerdown':
      case 'mousedown':
        startPoint = [event.event.clientX, event.event.clientY];
        createScreenSpaceCanvas2D(scene);
        onPointerDragEvent(event, startPoint, scene);
        break;
      case 'pointermove':
      case 'mousemove':
        // selection rectangle is
        //automatically
        //deleted here in case mouseup
        //is done outside canvas
        //with mousemove without left click
        if (!isLeftClicked) {
          deleteSelectionRectangle(scene);
          deleteScreenSpaceCanvas2D(scene);
        } else {
          rectangleProps = onPointerDragEvent(event, startPoint, scene);
        }
        break;
      default:
        break;
    }
    return;
  });
}

export default {
  instantiateEvents,
  ghostBuildingManager,
  endGhostBuildingManager,
};
