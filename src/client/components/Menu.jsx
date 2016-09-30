import React from 'react';
import actions from '../flux/actions.js';
import { connect } from 'react-redux';

const Menu = ( { guys, createOneGuy } ) => {
	return (
		<div>
			
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
