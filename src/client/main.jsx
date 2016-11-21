import React from 'react';
import BABYLON from 'babylonjs';
import CANNON from 'cannon';
import { render } from 'react-dom';

import { createStore } from 'redux'
import reducer from './flux/reducer.js';
import { Provider } from 'react-redux';

import App from './components/App.jsx';

let store = createStore(
	reducer,
);

//Dev ONLY 
window.store = store;
window.BABYLON = BABYLON;
window.CANNON = CANNON;

render(
	<Provider store={ store }>
		<App/>
	</Provider>,
	document.getElementById('app')
);
