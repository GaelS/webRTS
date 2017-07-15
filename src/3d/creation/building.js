import BABYLON from 'babylonjs';
import uuid from 'uuid';
import interaction from '../interaction.js';
import { vector3 } from '../utils.js';
import _ from 'lodash';
import { 
		creatingBuilding as creatingBuildingAction,
		buildingIsDone as buildingIsDoneAction, 
		characterIsCreated as characterIsCreatedAction,
 	} from '../../flux/actions.js';
import * as buildingTypes from '../../types/buildings.js';
import * as characterTypes from '../../types/characters.js';
import { createGuy } from './character.js';
import { addPhysicsProps } from '../physics.js';

export const startBuildingCreation = ( scene, type ) => {
	let shadowMesh = scene.getMeshByID('shadowBuilding');
	//instantiating event for ghost building
	//if not already instantiated
	!shadowMesh.type && interaction.ghostBuildingManager(scene);
	shadowMesh.type = type;
	shadowMesh.standardMaterial = scene.getMaterialByName( type.material ); 
	shadowMesh.material = shadowMesh.standardMaterial;
	shadowMesh.checkCollisions = true;
};

export const endBuildingCreation = ( scene ) => {
	let shadowMesh = scene.getMeshByID('shadowBuilding');
	//Redux event
	scene.dispatchEvents( creatingBuildingAction(shadowMesh.position, buildingTypes[ shadowMesh.type.label ], false) );
};
export const resetShadowBuilding = scene => {
	let shadow = scene.getMeshByID( 'shadowBuilding' );
	shadow.visibility = 0;
	shadow.type = null;
	shadow.checkCollisions = false;
	interaction.endGhostBuildingManager(scene);
};

export const createBuilding = ( scene, position, type, shadow ) => {
	//Do not add shadow building if one is already created
	if( !!scene.getMeshByID( 'shadowBuilding' )  && shadow ) return; 
	let id = !shadow ? uuid.v1() : 'shadowBuilding';
	let s = BABYLON.Mesh.CreateBox( id, 20, scene ); 
	if( !shadow ) addPhysicsProps( s, BABYLON.PhysicsImpostor.BoxImpostor, 0, 0, 0, scene );
	s.position = position;
	s.standardMaterial = scene.getMaterialByName( type.material || 'yellowMaterial' );
	s.material = s.standardMaterial;
	s.onSelect = (evt) => { s.material = scene.getMaterialByName('selectionMaterial') };
	s.onDeselect = (evt) => { s.material = s.standardMaterial };
	s.type = type;
	s.isPickable = shadow ? false : true;
	s.visibility = !shadow ? 1 : 0;
	s.scaling = vector3(1, ( !shadow ? 0.1 : 1 ), 1);
	s.underConstruction = true;
	s.characterCreationStack = [];
	s.characterOnCreation = [];
	return s.id;
};

export const addCharacterToCreate = ( scene, type, buildingID, delay ) => {
	let building = scene.getMeshByID(buildingID);
	building.characterOnCreation.push( type );
	let delayedCharacterCreation = () => setTimeout( () => {
		//launch creation
		createGuy( scene, 1, type, buildingID );
		scene.dispatchEvents( characterIsCreatedAction( buildingID ));
		//remove last element of the stack
		scene.getMeshByID(buildingID).characterCreationStack.pop();
		scene.getMeshByID(buildingID).characterOnCreation.pop();
		//active next creation to create if
		//there is one
		let stack = scene.getMeshByID(buildingID).characterCreationStack;
		if(stack.length > 0) _.last(stack).apply(this);
	}, delay );
	
	//add function to be executed when 
	//previous ones have been terminated
	scene.getMeshByID(buildingID).characterCreationStack.push(delayedCharacterCreation);
	//bootstrap character creation  if length == 1
	let stack = scene.getMeshByID(buildingID).characterCreationStack;
	if( stack.length === 1 ) stack[0].apply(this);
};