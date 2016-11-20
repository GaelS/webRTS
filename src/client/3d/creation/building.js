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

export const startBuildingCreation = ( scene, type ) => {
	//instantiating event for ghost building
	interaction.ghostBuildingManager(scene);
	let shadowMesh = scene.getMeshByID('shadowBuilding');
	shadowMesh.type = type;
};

export const endBuildingCreation = (scene) => {
	let shadowMesh = scene.getMeshByID('shadowBuilding');
	let pos = shadowMesh.position;
	//Redux event
	scene.dispatchEvents( creatingBuildingAction(pos, buildingTypes[shadowMesh.type].label, false) );
	//set visibility back to 0
	shadowMesh.visibility = 0;
	shadowMesh.type = null;
	//removing event for ghost building
	interaction.endGhostBuildingManager(scene);
};

export const createBuilding = ( scene, position, type, shadow ) => {
	//Do not add shadow building if one is already created
	if( !!scene.getMeshByID( 'shadowBuilding' )  && shadow ) return; 
	let id = !shadow ? uuid.v1() : 'shadowBuilding';
	let s = BABYLON.Mesh.CreateBox( id, 20, scene ); 
	s.position = position;
	s.material = scene.getMaterialByName('yellowMaterial');
	s.onSelect = (evt) => { s.material = scene.getMaterialByName('blackerMaterial') };
	s.onDeselect = (evt) => { s.material = scene.getMaterialByName('greenMaterial') };
	s.type = type;
    s.class = 'BUILDING';
	s.isPickable = shadow ? false : true;
	s.visibility = !shadow ? 1 : 0;
	s.scaling = vector3(1, !shadow ? 0 : 1,1);
	s.underConstruction = true;
	!shadow && [1,2,3,4].map( e => setTimeout(() => {
			s.underConstruction = false;
			if(e === 4 ){ 
				s.material = scene.getMaterialByName('greenMaterial');
				scene.dispatchEvents( buildingIsDoneAction(s.id) );
			} else {
				s.scaling = vector3(1,0.25 * e,1);
			} 
		},e * 1000) );
	return s.id;
};

export const addCharacterToCreate = ( scene, type, buildingID, delay ) => {
	//launch character creation after cooldown
	setTimeout( () => {
		createGuy( scene, 1, type, buildingID );
		scene.dispatchEvents( characterIsCreatedAction( buildingID ))
		console.log('CREATING',type)
	}, delay );
};