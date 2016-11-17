import React from 'react';
import actions from '../flux/actions.js';
import { connect } from 'react-redux';

const Menu = ( { guys, createOneGuy } ) => {
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
		</div>
	);
}

const mapDispatchToProps = (dispatch) => {
	return {
		createOneGuy : () => dispatch( actions.createGuy(1) ),
	}
};

const mapStateToProps = (state) => {
	return {
		guys : state.guys.length,
	}
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Menu);
