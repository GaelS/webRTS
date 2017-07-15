import {put} from 'redux-saga/effects';
import {delay} from 'redux-saga';

import {updateUnderConstructionBuilding} from "./actions"

//manage buildings under construction
function* updateConstructionBuilding() {
  while(true) {
    yield put(updateUnderConstructionBuilding());
    yield delay(1000);
  }
}

export default function* mySaga(){
  yield updateConstructionBuilding();
}