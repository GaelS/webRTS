import React from 'react';
import { initScene } from '../flux/actions.js';
import { connect } from 'react-redux';
import Menu from './Menu.js';

class App extends React.Component {

    componentDidMount(){
        this.props.initScene(
            this.props.dispatchEvents,
        );
    }

    render(){
        const S = {
            canvas : {
                width : '100%',
                height : '100%',
                touchAction : 'none',
            },
        };
    	return (
    		<div>
	    		<canvas 
                    style = { S.canvas }
	    			id='3dview'
	    		>
	    		</canvas>
                <Menu />
    		</div>
    	);
    }
};


const mapDispatchToProps = ( dispatch ) => {
    return {
        initScene : (dispatchEvents) => dispatch( initScene(dispatchEvents) ),
        dispatchEvents : (action) => dispatch(action),
    }
};

export default connect(
    null /* mapStateToProps */,
    mapDispatchToProps,
)(App);