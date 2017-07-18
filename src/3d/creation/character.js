import BABYLON from 'babylonjs';
import uuid from 'uuid';
import _ from 'lodash';
import { vector3 } from '../utils.js';
import { addPhysicsProps } from '../physics.js';

function createGuy({ scene, quantity, type, buildingID }) {
  let buildingPosition = !!buildingID
    ? scene.getMeshByID(buildingID).position.add(vector3(30, 30, 30))
    : vector3(30, 100, 30);
  return _.range(quantity).map(i => {
    let mesh = BABYLON.Mesh.CreateBox(uuid.v1(), 2, scene);
    mesh.position = buildingPosition;
    addPhysicsProps({
      mesh,
      impostor: BABYLON.PhysicsImpostor.BoxImpostor,
      mass: 1,
      restitution: 0,
      friction: 0.11,
      scene,
    });
    mesh.standardMaterial = scene.getMaterialByName(
      type.material || 'yellowMaterial'
    );
    mesh.material = mesh.standardMaterial;
    mesh.onSelect = evt => {
      mesh.material = scene.getMaterialByName('selectionMaterial');
    };
    mesh.onDeselect = evt => {
      mesh.material = mesh.standardMaterial;
    };
    mesh.type = type;
    return mesh.id;
  });
}

export { createGuy };
