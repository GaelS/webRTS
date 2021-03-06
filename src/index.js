import React from 'react';
import BABYLON from 'babylonjs';

import './canvas2D';
import CANNON from 'cannon';
import { render } from 'react-dom';

import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleWare from 'redux-saga';
import reducer from './flux/reducer.js';
import mySaga from './flux/mySaga.js';
import { Provider } from 'react-redux';

import App from './components/App';

const sagaMiddleware = createSagaMiddleWare();
let store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(sagaMiddleware)
);

//Dev ONLY
window.store = store;
window.BABYLON = BABYLON;
window.CANNON = CANNON;

sagaMiddleware.run(mySaga);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
