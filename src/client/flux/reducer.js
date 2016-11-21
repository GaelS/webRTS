import defaultState from './defaultState.js';

import creation from '../3d/creation/_index.js';
import interaction from '../3d/interaction.js'
import movement from '../3d/movement.js';
import materials from '../3d/materials.js';
import R from 'ramda';
import * as characterTypes from '../types/characters.js';

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
			//Stop creation in building in already under construction
			if(!newState.scene.getMeshByID(currentBuilding).underConstruction){
				let typeToCreate = characterTypes[ value.type ];
				let delay = typeToCreate.cooldown || 0;
				//add new character type to create to the building selected
				newState.charactersOnCreation[ currentBuilding ] = [ 
					...(newState.charactersOnCreation[currentBuilding] || [] ),
					{
						type : typeToCreate.label,
						duration : delay,
					}, 
				];
				creation.addCharacterToCreate( newState.scene, typeToCreate.label, currentBuilding, delay );
			}
			break;
		case 'CHARACTER_CREATED' :
			newState.charactersOnCreation[ value.buildingId ].pop();  
			break;
		case 'CLICK_ON_BUILDING_CREATION' :
			newState.shadowBuildingDisplayed = true;
			creation.startBuildingCreation( newState.scene, value.type );
			break;	 
		case 'CREATING_BUILDING' :
			let { position, type } = value;
			let id = creation.createBuilding( newState.scene, position, type, false );
			newState.shadowBuildingDisplayed = false;
			newState.buildingOnCreation = [ ...newState.buildingOnCreation, id ];
			break;	 
		case 'BUILDING_IS_DONE' : 
			newState.buildingOnCreation = _.without(value.id);
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
		case 'SET_TARGET_CHARACTER' : 
			let meshes = _.chain(newState.selectedMeshes)
							.map(elt => {
								let mesh = newState.scene.getMeshByID(elt);
								//move only character class polygon
								return mesh.class === 'CHARACTER' ? mesh : null; 
							} )
							.compact()
							.value();
			let meshesID = meshes.map( m => m.id );
			
			if( !!value.buildingId ) {
				//update current Workers
				_.chain( Object.keys( newState.busyCharacters ) )
						.forEach( ( buildingID ) => {
							//clean reassigned meshes
							let updatedWorkers = newState.busyCharacters[ buildingID ]
								.filter( worker => meshesID.indexOf(worker) === -1 );
							newState.busyCharacters[ buildingID ] = updatedWorkers;			
						} )
						.value();
				let currentWorkers = newState.busyCharacters[ value.buildingId ] || [];
				newState.busyCharacters[ value.buildingId ] =  _.uniq( [ ...meshesID, ...currentWorkers ] );
			}
			movement.setTargetPosition( meshes, value.target );
			break;
			case 'UPDATE_UNDER_CONSTRUCTION_BUILDING':
				newState.buildingOnCreation.forEach( id => {
					let workers = newState.busyCharacters[ id ] || [];
					if( !!workers &&  workers.length !== 0 ){
						let building = newState.scene.getMeshByID( id );
						let currentHeight = building.scaling.y;
						let tmpHeight = currentHeight + workers.length  * 0.5;
						let updatedHeight = tmpHeight >= 4 ? 4 : tmpHeight;
						building.status = updatedHeight/4;
						//Set new height
						building.scaling.y = updatedHeight
						let buildingDone = ( updatedHeight === 4 );
						if( buildingDone ){
							newState.busyCharacters[ id ] = _.remove( newState.busyCharacters[ id ], workers ) || [];
							newState.buildingOnCreation = _.remove( newState.buildingOnCreation, id ) || [];
							//update building
							//to not be considered as under construction
							//and having proper properties
							building.underConstruction = false;
							building.status = null;
							building.characterCreationStack = [];
						}
					}
				} );
				break;
	}
	return newState;
} );