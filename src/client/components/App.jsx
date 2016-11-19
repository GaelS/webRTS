import React from 'react';
import { initScene } from '../flux/actions.js';
import { connect } from 'react-redux';
import Menu from './Menu.jsx';

class App extends React.Component {
    
    constructor(props){
	    super(props);
    }

    componentDidMount(){
        this.props.initScene(
            this.props.dispatchEvents,
            // this.props.startSelection,
            // this.props.endSelection,
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

const mapStateToProps = ( state ) => {
    return {
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);