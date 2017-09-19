import { put, takeEvery, spawn, all, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { updateUnderConstructionBuilding, LAUNCH_GUY_CREATION, createGuy } from './actions';
import * as characters from '../types/characters';

//manage buildings under construction
function* updateConstructionBuilding() {
  while (true) {
    yield put(updateUnderConstructionBuilding());
    yield delay(1000);
  }
}

function* startCharacterCreation(){
  const {action, payload} = yield takeEvery(LAUNCH_GUY_CREATION, delayGuyCreation);
}
function* delayGuyCreation({action,value: {type}}){
  const selectedBuilding = yield select(state=>state.selectedMeshes[0]);
  const scene = yield select(state=> state.scene);
  scene.getMeshByID(selectedBuilding).charactersOnCreation = scene.getMeshByID(selectedBuilding).charactersOnCreation + 1;
  const waitingList = scene.getMeshByID(selectedBuilding).charactersOnCreation;
  const delayToApply = waitingList * characters[type].cooldown + 2000;
  yield delay(delayToApply);
  yield put(createGuy(1, type));
  scene.getMeshByID(selectedBuilding).charactersOnCreation = scene.getMeshByID(selectedBuilding).charactersOnCreation - 1;
}

export default function* mySaga() {
  yield all ([
    updateConstructionBuilding(),
    startCharacterCreation(),
  ]);
}
