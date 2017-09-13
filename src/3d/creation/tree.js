import uuid from 'uuid';
import _ from 'lodash';
import BABYLON from 'babylonjs';
import {wood} from '../../types/resources';
import {vector3} from '../utils';
import randomColor from 'randomcolor';

function createTree(scene, groundExtends) {
  _.range(0, 100).forEach(n => {
    const x = Math.random()*groundExtends;
    const z = Math.random()*groundExtends;    
    const height = 5;
    createTrunk(x, height, z, scene);
    createTunkHead(x, height, z, scene);
  });
};

function createTrunk(x,height,z, scene) {
  const trunk = BABYLON.MeshBuilder.CreateCylinder(uuid.v1(), {diametrerTop: 0.2, diameterBottom:0.5, height}, scene);
  trunk.position = vector3(x,height/2,z);
  trunk.type = wood;
  // The trunk color
  const trunkColor = randomColor({hue: 'orange',luminosity: 'dark', format: 'rgbArray'});
  trunk.material = new BABYLON.StandardMaterial("trunk", scene);
  trunk.material.diffuseColor = BABYLON.Color3.FromInts(trunkColor[0],trunkColor[1],trunkColor[2]);
  trunk.material.specularColor = BABYLON.Color3.Black();
  trunk.isPickable = true;
  // The trunk is converted in a flat shaded mesh !
  //trunk.convertToFlatShadedMesh();
  scene.shadowGenerator.getShadowMap().renderList.push(trunk);
}

function createTunkHead(x, height, z, scene){
  const icosphere = BABYLON.MeshBuilder.CreateIcoSphere(uuid.v1(), {radius: 2, subdivisions: 2, flat: true}, scene);  
  icosphere.position = vector3(x, height, z);
  const branchColor = randomColor({hue: 'green', luminosity: 'darl', format: 'rgbArray'});
  icosphere.material = new BABYLON.StandardMaterial("mat", scene);
  icosphere.material.diffuseColor = BABYLON.Color3.FromInts(branchColor[0],branchColor[1],branchColor[2]);
  icosphere.material.specularColor = BABYLON.Color3.Black();
  //icosphere.convertToFlatShadedMesh();
  icosphere.isPickable = true;
  icosphere.type = wood;
  icosphere.remainingHitsBeforeFalling = 10;
  icosphere.quantity = 100;
  scene.shadowGenerator && scene.shadowGenerator.getShadowMap().renderList.push(icosphere);
}

export {createTree};
