import defaultState from './defaultState.js';

import creation from '../3d/creation/_index.js';
import interaction from '../3d/interaction.js'
import movement from '../3d/movement.js';
import materials from '../3d/materials.js';
import { vector3 } from '../3d/utils.js';
import R from 'ramda';
import * as characterTypes from '../types/characters.js';
import BABYLON from 'babylonjs';

export default ( ( state = defaultState, action ) => {
	let newState = R.clone( R.omit('scene',state ) );
	//scene cannot be cloned
	newState.scene = state.scene;
	console.log(action.type)
	let value = action.value;
	switch(action.type){
		case 'INIT' :
			let scene = creation.initScene(
				value.dispatchEvents,
			);
			newState.scene = scene;
			break;
		case 'CREATE_GUY' :
			newState.guys = [...state.guys,
			 ...creation.createGuy( newState.scene, value.qty, value.type ) ];
			 break;
		case 'LAUNCH_GUY_CREATION' :
			//only one building can be selected
			//when guy creation is launched
			let currentBuilding = newState.selectedMeshes[0];
			let typeToCreate = characterTypes[ action.value.type ];
			let delay = typeToCreate.cooldown || 0;
			//add new character type to create to the building selected
			newState.charactersOnCreation[ currentBuilding ] = [ 
				...(newState.charactersOnCreation[currentBuilding] || [] ),
				{
					type : typeToCreate.label,
					timestamp : Date.now(),
					duration : delay,
				}, 
			];
			creation.addCharacterToCreate( newState.scene, typeToCreate.label, currentBuilding, delay );
			break;
		case 'CHARACTER_CREATED' :
			console.log(newState.charactersOnCreation[ action.value.buildingId ] );
			newState.charactersOnCreation[ action.value.buildingId ].pop();  
			console.log(newState.charactersOnCreation[ action.value.buildingId ])
			break;
		case 'CLICK_ON_BUILDING_CREATION' :
			newState.shadowBuildingDisplayed = true;
			creation.startBuildingCreation( newState.scene, action.value.type );
			break;	 
		case 'CREATING_BUILDING' :
			let { position, type } = action.value;
			let id = creation.createBuilding( newState.scene, position, type, false );
			newState.shadowBuildingDisplayed = false;
			newState.buildingOnCreation = [ ...newState.buildingOnCreation, id ];
			break;	 
		case 'BUILDING_IS_DONE' : 
			newState.buildingOnCreation = _.without(action.value.id);
			break;
		case 'START_SELECTION' :
			//Reset already selected meshes
			materials.deselectMeshes( newState.scene, newState.selectedMeshes );
			materials.selectMeshes( newState.scene, value );
			newState.selectedMeshes = value;
			break;
		case 'DESELECT_ALL' :
			materials.deselectMeshes(newState.scene, newState.selectedMeshes);
			newState.selectedMeshes = [];
			break;
		case 'MOVE_SELECTION' : 
			let { x,z } = action.value;
			let meshes = _.chain(newState.selectedMeshes)
							.map(elt => {
								let mesh = newState.scene.getMeshByID(elt);
								//move only character class polygon
								return mesh.class === 'CHARACTER' ? mesh : null; 
							} )
							.compact()
							.value();
			movement.setTargetPosition(meshes, vector3(x, 0, z));
			break;
	}
	return newState;
} );