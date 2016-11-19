import React from 'react';
import { createGuy, startBuildingCreation } from '../flux/actions.js';
import { connect } from 'react-redux';

const Menu = ( { guys, selectedGuys, startBuildingCreation, createOneGuy } ) => {
	const S = {
		menu : {
			position : 'absolute',
			bottom : '0px',
		},
	};
	return (
		<div
			style={ S.menu }
		>
			<input
				type='button'
				value='create peon'
				onClick={ createOneGuy }
			/>
			{ selectedGuys.length !== 0 && 
				<input
					type='button'
					value='create a building'
					onClick={ startBuildingCreation }
				/>	
			}
		</div>

	);
}

const mapDispatchToProps = (dispatch) => {
	return {
		createOneGuy : () => dispatch( createGuy(1, 'citizen') ),
		startBuildingCreation : () => dispatch( startBuildingCreation() ),
	}
};

const mapStateToProps = (state) => {
	return {
		guys : state.guys.length,
		selectedGuys : state.selectedMeshes.filter(m => state.scene.getMeshByID(m).type === 'citizen'),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Menu);
