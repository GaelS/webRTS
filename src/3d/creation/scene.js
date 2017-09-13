import BABYLON from 'babylonjs';
import interaction from '../interaction';
import movement from '../movement';
import { vector3 } from '../utils';
import materialsLib from '../materials';
import createCamera from '../camera/camera';
import * as characterTypes from '../../types/characters';
import { createBuilding } from './building';
import { createGuy } from './character';
import initResources from './resources';
import { addPhysicsProps } from '../physics';

function enablePhysics(scene) {
  scene.enablePhysics(vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
}

function createScene({ dispatchEvents, engine, canvas }) {
  const scene = new BABYLON.Scene(engine);
  enablePhysics(scene);
  materialsLib.initMaterials(scene);
  scene.clearColor = new BABYLON.Color3(0, 0, 1);
 
  const light = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(1, -1, -2), scene);
  light.position = new BABYLON.Vector3(-300,300,600);
  const shadowGenerator = new BABYLON.ShadowGenerator(2048, light);
  scene.shadowGenerator = shadowGenerator;

  const groundMaterial = new BABYLON.StandardMaterial('ground', scene);
  groundMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
  
  const ground = BABYLON.Mesh.CreateGroundFromHeightMap(
    'ground',
    'http://localhost:3001/terrain.jpg',
    600,
    600,
    250,
    0,
    50,
    scene,
    false,
    () => {
      addPhysicsProps({
        mesh: ground,
        impostor: BABYLON.PhysicsImpostor.HeightmapImpostor,
        mass: 0,
        restitution: 0.3,
        friction: 0.1,
        scene,
      });
      ground.material = groundMaterial;
      ground.position = vector3(300, 0, 300);
    }
  );
  ground.receiveShadows = true;
  createCamera(canvas, scene);
  interaction.instantiateEvents(canvas, scene, dispatchEvents);
  scene.dispatchEvents = dispatchEvents;
  initResources(scene, 600);

  //Shadow building instantiation
  createBuilding({ scene, position: vector3(0, 0, 0), type: '', shadow: true });
  //First guy instantiation
  createGuy({ scene, quantity: 1, type: characterTypes.CITIZEN });
  return scene;
}

export default function(dispatchEvents) {
  const canvas = document.getElementById('3dview');
  const engine = new BABYLON.Engine(document.getElementById('3dview'), true);
  const scene = createScene({ canvas, engine, dispatchEvents });

  scene.registerBeforeRender(function() {
    movement.updatePositions(scene);
  });

  engine.runRenderLoop(() => {
    scene.render();
  });
  // Watch for browser/canvas resize events
  window.addEventListener('resize', function() {
    //dispose and redraw canvas2D for rectangle selection
    if (!!scene.screenSpaceCanvas2D) scene.screenSpaceCanvas2D.dispose();
    engine.resize();
  });
  return scene;
}
