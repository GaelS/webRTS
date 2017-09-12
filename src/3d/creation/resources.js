import uuid from 'uuid';
import _ from 'lodash';
import BABYLON from 'babylonjs';
import * as resourcesTypes from '../../types/resources';
import {vector3} from '../utils';
function initRandomResources(scene, groundExtends) {
  console.log(BABYLON)
  _.range(0, 100 , 1).forEach(n => {
    const cylinder = BABYLON.MeshBuilder.CreateCylinder(uuid.v1(), {}, scene);
    cylinder.position = vector3(Math.random()*groundExtends,2,Math.random()*groundExtends);
    cylinder.type = resourcesTypes.wood;
  });
};


export default initRandomResources;