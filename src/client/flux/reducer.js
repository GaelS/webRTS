import R from 'ramda';

import defaultState from './defaultState';

import creation from '../3d/creation/_index';
import interaction from '../3d/interaction'
import movement from '../3d/movement';
import materials from '../3d/materials';

import { setVelocity } from '../3d/physics.js';
import { vector3 } from '../3d/utils';

import * as characterTypes from '../types/characters';

import * as navigation from '../navigation/flowFieldManager';

export default ( ( state = defaultState, action ) => {
	//omit because clonig state
	//convert custom class to plain object
	let newState = R.clone( R.omit( [ 'scene', 'flowField' ], state ) );
	//scene cannot be cloned
	newState.scene = state.scene;
	newState.flowField = state.flowField;
	//console.log(action.type)
	let value = action.value;
	switch(action.type){
		case 'INIT' :
			let scene = creation.initScene(
				value.dispatchEvents,
			);
			newState.scene = scene;
			newState.flowField = navigation.createFlowField( scene.getMeshByName('ground' ) );
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
						type : typeToCreate,
						duration : delay,
					}, 
				];
				creation.addCharacterToCreate( newState.scene, typeToCreate, currentBuilding, delay );
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
			//add selected characters to busy stack for the new IS
			newState.busyCharacters[ id ] =  newState.selectedMeshes.map(mesh => mesh.id);
			break;
		case 'START_SELECTION' :
			//Reset already selected meshes
			materials.deselectMeshes( newState.scene, newState.selectedMeshes );
			materials.selectMeshes( newState.scene, value );
			newState.selectedMeshes = value;
			break;
		case 'DESELECT_ALL' :
			if( !newState.shadowBuildingDisplayed ) {
				materials.deselectMeshes(newState.scene, newState.selectedMeshes);
				newState.selectedMeshes = [];
			}
			break;
		case 'SET_TARGET_CHARACTER' : 
			let meshes = _.chain(newState.selectedMeshes)
							.map(elt => {
								let mesh = newState.scene.getMeshByID(elt);
								//move only character class polygon
								return mesh.type.class === 'CHARACTER' ? mesh : null; 
							} )
							.compact()
							.value();
			let meshesID = meshes.map( m => m.id );
			
			//update current workers
			_.chain( Object.keys( newState.busyCharacters ) )
				.forEach( ( buildingID ) => {
					//clean reassigned meshes
					let updatedWorkers = newState.busyCharacters[ buildingID ]
						.filter( worker => meshesID.indexOf(worker) === -1 );
						newState.busyCharacters[ buildingID ] = updatedWorkers;		
				} )
				.value();
			
			if( !!value.buildingId ) {
				let currentWorkers = newState.busyCharacters[ value.buildingId ] || [];
				newState.busyCharacters[ value.buildingId ] =  _.uniq( [ ...meshesID, ...currentWorkers ] );
			}
			movement.setTargetPosition( meshes, value.target, value.buildingId, newState.scene );
			navigation.updateTarget(value.target, newState.flowField );
			break;
			case 'UPDATE_UNDER_CONSTRUCTION_BUILDING':
				newState.buildingOnCreation.forEach( id => {
					let workers = newState.busyCharacters[ id ] || [];
					if( !!workers &&  workers.length !== 0 ){
						let building = newState.scene.getMeshByID( id );
						let currentHeight = building.scaling.y;
						let tmpHeight = currentHeight + workers.length  * 1;//0.1;
						let updatedHeight = tmpHeight >= 2 ? 2 : tmpHeight;
						building.status = updatedHeight/4;
						//Set new height
						building.scaling.y = updatedHeight
						let buildingDone = ( updatedHeight === 2 );
						if( buildingDone ){
							newState.busyCharacters[ id ] = _.remove( newState.busyCharacters[ id ], workers ) || [];
							newState.buildingOnCreation = _.remove( newState.buildingOnCreation, id ) || [];
							//update building
							//to not be considered as under construction
							//and having proper properties
							building.underConstruction = false;
							building.status = null;
							//update flowField accordingly
							navigation.updateFlowField( newState.scene, newState.flowField );
						}
					}
				} );
				break;
				case 'UPDATE_MESHES_POSITION' : 
					//update velocity moving meshes
					newState.scene.meshes.filter(mesh => !!mesh.targetPosition)
						.forEach( mesh => { 
							let position = mesh.position;
							let tile = navigation.getTile( mesh.position, newState.flowField )
							let remainingPath = mesh.targetPosition.subtract( mesh.position );
							let isMovementDone = !tile || remainingPath.length() < 3 || tile.distance === 0;
							mesh.targetPosition =  !isMovementDone ? mesh.targetPosition : undefined;
							setVelocity( 
								mesh,
								isMovementDone ? vector3( 0,0,0 ) : vector3( tile.direction[0],0, tile.direction[1] ),
								isMovementDone ? 0 : mesh.type.speed 
							);
						} );
					break;
	}	
	return newState;
} );