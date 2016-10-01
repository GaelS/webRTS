import React from 'react';
import actions from '../flux/actions.js';
import { connect } from 'react-redux';
import Menu from './Menu.jsx';

class App extends React.Component {
    
    constructor(props){
	    super(props);
    }

    componentDidMount(){
        this.props.initScene(this.props.startSelection, this.props.endSelection);
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
        initScene : (startSelection, endSelection) => dispatch( actions.initScene(startSelection, endSelection) ),
        startSelection : (x,y) => dispatch( actions.startSelection(x,y) ),
        endSelection : (x,y) => dispatch( actions.endSelection(x,y) ),
    }
};
export default connect(
    null,
    mapDispatchToProps
)(App);