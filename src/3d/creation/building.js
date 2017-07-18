import BABYLON from 'babylonjs';
import uuid from 'uuid';
import interaction from '../interaction.js';
import { vector3 } from '../utils.js';
import _ from 'lodash';
import {
  creatingBuilding as creatingBuildingAction,
  characterIsCreated as characterIsCreatedAction,
} from '../../flux/actions.js';
import * as buildingTypes from '../../types/buildings.js';
import { createGuy } from './character.js';
import { addPhysicsProps } from '../physics.js';

function startBuildingCreation(scene, type) {
  let shadowMesh = scene.getMeshByID('shadowBuilding');
  //instantiating event for ghost building
  //if not already instantiated
  !shadowMesh.type && interaction.ghostBuildingManager(scene);
  shadowMesh.type = type;
  shadowMesh.standardMaterial = scene.getMaterialByName(type.material);
  shadowMesh.material = shadowMesh.standardMaterial;
  shadowMesh.checkCollisions = true;
}

function endBuildingCreation(scene) {
  let shadowMesh = scene.getMeshByID('shadowBuilding');
  //Redux event
  scene.dispatchEvents(
    creatingBuildingAction(
      shadowMesh.position,
      buildingTypes[shadowMesh.type.label],
      false
    )
  );
}

function resetShadowBuilding(scene) {
  let shadow = scene.getMeshByID('shadowBuilding');
  shadow.visibility = 0;
  shadow.type = null;
  shadow.checkCollisions = false;
  interaction.endGhostBuildingManager(scene);
}

function createBuilding({ scene, position, type, shadow = false }) {
  //Do not add shadow building if one is already created
  if (!!scene.getMeshByID('shadowBuilding') && shadow) return;
  let id = !shadow ? uuid.v1() : 'shadowBuilding';
  let mesh = BABYLON.Mesh.CreateBox(id, 20, scene);
  if (!shadow)
    addPhysicsProps({
      mesh,
      impostor: BABYLON.PhysicsImpostor.BoxImpostor,
      mass: 0,
      restitution: 0,
      friction: 0,
      scene,
    });
  mesh.position = position;
  mesh.standardMaterial = scene.getMaterialByName(
    type.material || 'yellowMaterial'
  );
  mesh.material = mesh.standardMaterial;
  mesh.onSelect = evt => {
    mesh.material = scene.getMaterialByName('selectionMaterial');
  };
  mesh.onDeselect = evt => {
    mesh.material = mesh.standardMaterial;
  };
  mesh.type = type;
  mesh.isPickable = shadow ? false : true;
  mesh.visibility = !shadow ? 1 : 0;
  mesh.scaling = vector3(1, !shadow ? 0.1 : 1, 1);
  mesh.underConstruction = true;
  mesh.characterCreationStack = [];
  mesh.characterOnCreation = [];
  return mesh.id;
}

function addCharacterToCreate({ scene, type, buildingID, delay }) {
  let building = scene.getMeshByID(buildingID);
  building.characterOnCreation.push(type);
  let delayedCharacterCreation = () =>
    setTimeout(() => {
      //launch creation
      createGuy({ scene, quantity: 1, type, buildingID });
      scene.dispatchEvents(characterIsCreatedAction(buildingID));
      //remove last element of the stack
      scene.getMeshByID(buildingID).characterCreationStack.pop();
      scene.getMeshByID(buildingID).characterOnCreation.pop();
      //active next creation to create if
      //there is one
      let stack = scene.getMeshByID(buildingID).characterCreationStack;
      if (stack.length > 0) _.last(stack).apply(this);
    }, delay);

  //add function to be executed when
  //previous ones have been terminated
  scene
    .getMeshByID(buildingID)
    .characterCreationStack.push(delayedCharacterCreation);
  //bootstrap character creation  if length == 1
  let stack = scene.getMeshByID(buildingID).characterCreationStack;
  if (stack.length === 1) stack[0].apply(this);
}

export {
  createBuilding,
  startBuildingCreation,
  addCharacterToCreate,
  resetShadowBuilding,
  endBuildingCreation,
};
