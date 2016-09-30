import React from 'react';
import actions from '../flux/actions.js';
import { connect } from 'react-redux';

class App extends React.Component {
    
    constructor(props){
	    super(props);
    }

    componentDidMount(){
        this.props.initScene()
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
    		</div>
    	)
    }
};


const mapDispatchToProps = ( dispatch ) => {
    return {
        initScene : () => dispatch( actions.initScene() ),
    }
};


export default connect(
    null,
    mapDispatchToProps
)(App);