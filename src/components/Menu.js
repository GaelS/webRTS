import React from 'react';
import { createGuy, launchGuyCreation, startBuildingCreation } from '../flux/actions.js';
import * as characterTypes from '../types/characters.js';
import * as buildingTypes from '../types/buildings.js';
import { connect } from 'react-redux';
import R from 'ramda';
import _ from 'lodash';
const Menu = ( props ) => {
	let { 
			startBuildingCreation,
			launchGuyCreation,
			buildingButtons,
			characterButtons,
			characterBeingCreated,
			selectedElements,
		} = props;
		
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
				characterButtons.map( ( type, i ) => 
					<input
						key={ i }
						type='button'
						value={ `create a ${ type.toLowerCase() }` }
						onClick={ () => launchGuyCreation( type ) }
					/>
				)	
			}
			{ buildingButtons.length !== 0 && 
				buildingButtons.map( ( type, i ) => 
					<input
						key={ i }
						type='button'
						value={ `create a ${ type.toLowerCase() }` }
						onClick={ () => startBuildingCreation( buildingTypes[ type ] ) }
					/>
				)	
			}
			{ selectedElements.length !== 0 && 
				
				selectedElements.map( ( element, i ) => 
					<div
						key={ i }
					>
						{ `${ element.type.label } // ${ element.life }${ !!element.status ? ` // ${ element.status }` : '' }` }
					</div>
				)
			}
			{ characterBeingCreated.length !== 0 && 
				
				characterBeingCreated.map( ( character, i ) => 
					<div
						key={ i }
					>
						{ character }
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
	let IsAbuildingSelected = !!firstMesh.type && firstMesh.type.class === 'BUILDING';
	//GET CHARACTERS BEING CREATED IF ANY
	let characterBeingCreated = !IsAbuildingSelected ? [] : ( _.map( firstMesh.characterOnCreation, type => type.label ) || [] ); 
	let selectedElements = state.selectedMeshes.map(m => {
		let mesh = state.scene.getMeshByID(m);
		return {
			mesh,
			type : mesh.type,
			life : mesh.life || 100,
			status : mesh.status,
		};
	} );
	return {
		selectedElements,
		characterBeingCreated,  
	};
};
const mergeProps = (stateProps, dispatchProps, ownProps) => {
	let getButtonsFromMeshes = bool => {
		return _.chain(stateProps.selectedElements)
				.map( s => ( bool ? s.type.buildings : s.type.characters ) || [] )
				.flatten()
				.uniq()
				.value();
	};
	return {
		buildingButtons : getButtonsFromMeshes(true),
		characterButtons : getButtonsFromMeshes(false),
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
