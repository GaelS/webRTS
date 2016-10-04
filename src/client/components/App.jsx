import React from 'react';
import actions from '../flux/actions.js';
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
            width : '100%',
            height : '100%',
            touchAction : 'none',
        };
    	return (
    		<div>
	    		<canvas 
                    style = { S }
	    			id='3dview'
	    		>
	    		</canvas>
                <Menu />
    		</div>
    	)
    }
};


const mapDispatchToProps = ( dispatch ) => {
    return {
        initScene : (dispatchEvents) => dispatch( actions.initScene(dispatchEvents) ),
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