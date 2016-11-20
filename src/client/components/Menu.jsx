import React from 'react';
import { createGuy, launchGuyCreation, startBuildingCreation } from '../flux/actions.js';
import * as characterTypes from '../types/characters.js';
import * as buildingTypes from '../types/buildings.js';
import { connect } from 'react-redux';
import R from 'ramda';

const Menu = ( { startBuildingCreation, launchGuyCreation, buildingButtons, characterButtons, characterBeingCreated } ) => {
	const S = {
		menu : {
			position : 'absolute',
			bottom : '0px',
			display : 'flex',	
		},
	};
	return (
		<div
			style={ S.menu }
		>
			{ characterButtons.length !== 0 && 
				characterButtons.map(type => 
					<input
						key={ type }
						type='button'
						value={ `create a ${ type.toLowerCase() }` }
						onClick={ () => launchGuyCreation( type ) }
					/>
				)	
			}
			{ buildingButtons.length !== 0 && 
				buildingButtons.map( type => 
					<input
						key={ type }
						type='button'
						value={ `create a ${ type.toLowerCase() }` }
						onClick={ () => startBuildingCreation( type ) }
					/>
				)	
			}
			{ characterBeingCreated.length !== 0 && 
				
				characterBeingCreated.map( ( character, i ) => 
					<div
						key={ i }
					>
						{ character.type }
					</div>
				)
			}
		</div>
	);
}

const mapDispatchToProps = (dispatch) => {
	return {
		launchGuyCreation : (type) => dispatch( launchGuyCreation( type ) ),
		startBuildingCreation : (type) => dispatch( startBuildingCreation(type) ),
	}
};

const mapStateToProps = (state) => {
	let firstID = state.selectedMeshes[0]; 
	let firstMesh = !!state.scene && !!firstID ? state.scene.getMeshByID( firstID  ) : {};
	let IsAbuildingSelected = firstMesh.class === 'BUILDING';
	//GET CHARACTERS BEING CREATED IF ANY
	let characterBeingCreated = !IsAbuildingSelected ? [] : ( state.charactersOnCreation[ firstID ] || [] ); 
	return {
		selectedMeshes : state.selectedMeshes.map(m => state.scene.getMeshByID(m)),
		characterBeingCreated,  
	};
};
const mergeProps = (stateProps, dispatchProps, ownProps) => {
	let getButtonsFromMeshes = (arrayOfTypes, type) => {
		return _.chain(stateProps.selectedMeshes)
				.map(m => !!arrayOfTypes[m.type]?arrayOfTypes[m.type][type]:null )
				.flatten()
				.uniq()
				.compact()
				.value();
	};
	return {
		buildingButtons : getButtonsFromMeshes(characterTypes, 'buildings'),
		characterButtons : getButtonsFromMeshes(buildingTypes, 'characters'),
		startBuildingCreation : dispatchProps.startBuildingCreation,
		launchGuyCreation : dispatchProps.launchGuyCreation,
		characterBeingCreated : stateProps.characterBeingCreated,		
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps,
)(Menu);
