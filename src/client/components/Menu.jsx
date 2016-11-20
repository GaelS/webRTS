import React from 'react';
import { createGuy, launchGuyCreation, startBuildingCreation } from '../flux/actions.js';
import * as characterTypes from '../types/characters.js';
import * as buildingTypes from '../types/buildings.js';
import { connect } from 'react-redux';
import R from 'ramda';

const Menu = ( props ) => {
	let { 
			startBuildingCreation,
			launchGuyCreation,
			buildingButtons,
			characterButtons,
			characterBeingCreated,
			selectedElements,
		} = props;
		console.log(props)
	console.log(characterButtons)
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
			{ selectedElements.length !== 0 && 
				
				selectedElements.map( ( element, i ) => 
					<div
						key={ i }
					>
						{ `${ element.type } // ${ element.life }` }
					</div>
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
	let selectedElements = state.selectedMeshes.map(m => {
		let mesh = state.scene.getMeshByID(m);
		return {
			mesh,
			type : mesh.type,
			life : mesh.life || 100,
		};
	} );
	return {
		selectedElements,
		characterBeingCreated,  
	};
};
const mergeProps = (stateProps, dispatchProps, ownProps) => {
	let getButtonsFromMeshes = (arrayOfTypes, type) => {
		return _.chain(stateProps.selectedElements)
				.map(m => !!arrayOfTypes[m.mesh.type]?arrayOfTypes[m.mesh.type][type]:null )
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
		selectedElements : stateProps.selectedElements,	
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps,
)(Menu);
