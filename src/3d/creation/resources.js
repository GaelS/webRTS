import uuid from 'uuid';
import _ from 'lodash';
import BABYLON from 'babylonjs';
import * as resourcesTypes from '../../types/resources';
import {vector3} from '../utils';
import {createTree} from './tree';

function initRandomResources(scene, groundExtends) {
  createTree(scene, groundExtends);
};

export default initRandomResources;