import {put, delay} from 'redux-saga';

import {updateUnderConstructionBuilding} from "./actions"
// setInterval( () => dispatchEvents( 
//   updateUnderConstructionBuilding() ), 1000 );


function* updateConstructionBuilding() {
  // while(true) {
  //   console.log('ici')
  //   yield put(updateUnderConstructionBuilding());
  //   yield delay(1000);
  // }
}

export default function* mySaga(){
  console.log('ici')
}