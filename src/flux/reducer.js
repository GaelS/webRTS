import _ from 'lodash';
import defaultState from './defaultState';

import creation from '../3d/creation';
import materials from '../3d/materials';

import { setVelocity } from '../3d/physics.js';
import { vector3 } from '../3d/utils';

import * as characterTypes from '../types/characters';

import * as navigation from '../navigation/flowFieldManager';

function generateNewState(state) {
  //convert custom class to plain object
  let newState = _.cloneDeep(_.omit(state, ['scene', 'flowField']));
  //BABYLONJS scene cannot be cloned
  newState.scene = state.scene;
  newState.flowField = state.flowField;
  return newState;
}

export default (state = defaultState, action) => {
  const newState = generateNewState(state);
  const { type, value } = action;
  switch (action.type) {
    case 'INIT':
      let scene = creation.initScene(value.dispatchEvents);
      newState.scene = scene;
      newState.flowField = navigation.createFlowField(
        scene.getMeshByName('ground'), scene
      );
      break;
    case 'CREATE_GUY':
      newState.guys = [
        ...state.guys,
        ...creation.createGuy({ scene: newState.scene, ...value }),
      ];
      break;
    case 'LAUNCH_GUY_CREATION':
      //only one building can be selected
      //when guy creation is launched
      let currentBuilding = [newState.selectedMeshes[0]];
      //Stop creation in building in already under construction
      currentBuilding
        .filter(
          currentBuilding =>
            !newState.scene.getMeshByID(currentBuilding).underConstruction
        )
        .forEach(currentBuilding => {
          let typeToCreate = characterTypes[value.type];
          let delay = typeToCreate.cooldown || 0;
          //add new character type to create to the building selected
          newState.charactersOnCreation[currentBuilding] = [
            ...(newState.charactersOnCreation[currentBuilding] || []),
            {
              type: typeToCreate,
              duration: delay,
            },
          ];
          creation.addCharacterToCreate({
            scene: newState.scene,
            type: typeToCreate,
            buildingID: currentBuilding,
            delay,
          });
        });
      break;
    case 'CHARACTER_CREATED':
      newState.charactersOnCreation[value.buildingId].pop();
      break;
    case 'CLICK_ON_BUILDING_CREATION':
      newState.shadowBuildingDisplayed = true;
      creation.startBuildingCreation(newState.scene, value.type);
      break;
    case 'CREATING_BUILDING':
      let { position, type } = value;
      //if shadow building is positionned
      //in O,O => error building spot
      //doing nothing
      if (!newState.currentPosition.available) return newState;
      let id = creation.createBuilding({
        scene: newState.scene,
        position,
        type,
      });

      //Clear shadowBuilding
      newState.shadowBuildingDisplayed = false;
      creation.resetShadowBuilding(newState.scene);
      //update list building being under construction
      newState.buildingUnderConstruction = [
        ...newState.buildingUnderConstruction,
        id,
      ];
      //update list of workers
      newState.busyCharacters = updateWorkersAssignment(
        newState.busyCharacters,
        newState.selectedMeshes,
        id
      );
      //update target position for the selected meshes
      updateSelectedMeshesTarget(
        newState.selectedMeshes,
        position,
        newState.flowField,
        newState.scene
      );
      break;
    case 'START_SELECTION':
      //Reset already selected meshes
      //only if not in building creation process
      if (!newState.shadowBuildingDisplayed) {
        materials.deselectMeshes(newState.scene, newState.selectedMeshes);
        materials.selectMeshes(newState.scene, value);
        newState.selectedMeshes = value;
      }
      break;
    case 'DESELECT_ALL':
      if (!newState.shadowBuildingDisplayed) {
        materials.deselectMeshes(newState.scene, newState.selectedMeshes);
        newState.selectedMeshes = [];
      }
      break;
    case 'SET_TARGET_CHARACTER':
      let meshes = _.chain(newState.selectedMeshes)
        .map(id => {
          let mesh = newState.scene.getMeshByID(id);
          //move only character class polygon
          return mesh.type.class === 'CHARACTER' ? mesh : null;
        })
        .compact()
        .value();

      //update current workers
      newState.busyCharacters = removeWorkersFromAssignment(
        newState.busyCharacters,
        newState.selectedMeshes
      );
      if(value.mesh) {
        const {id: meshID, type: meshType} = value.mesh
        switch(meshType.label){
          case 'WOOD':
          //Add tree being damaged
          break;
          case 'BUILDING':
            addWorkersToBuildingUnderConstruction(
              newState.busyCharacters,
              meshID,
              newState.selectedMeshes
            );
            break;
            default:
              break;
        }
      }
        const targetPosition = value.mesh
          ? newState.scene.getMeshByID(value.mesh.id).position
          : value.target;

        //update target position for selected meshes
      updateSelectedMeshesTarget(
        newState.selectedMeshes,
        targetPosition,
        newState.flowField,
        newState.scene
      );
      break;

    case 'UPDATE_UNDER_CONSTRUCTION_BUILDING':
      _.chain(newState.buildingUnderConstruction)
        //filter to not consider building under construction
        //without workers assigned on it
        .filter(id => newState.busyCharacters[id].length !== 0)
        .forEach(id => {
          const workers = newState.busyCharacters[id];
          const building = newState.scene.getMeshByID(id);
          const currentHeight = building.scaling.y;
          //get workers close enough to
          //actually build
          const activeWorkers = workers
            .map(w =>
              newState.scene
                .getMeshByID(w)
                .position.subtract(building.position)
                .length()
            )
            .filter(distance => distance < 30).length;
          const tmpHeight = currentHeight + activeWorkers * 1; //0.1;
          const updatedHeight = tmpHeight >= 2 ? 2 : tmpHeight;
          building.status = updatedHeight / 4;
          //Set new height
          building.scaling.y = updatedHeight;
          const buildingDone = updatedHeight === 2;
          if (buildingDone) {
            newState.busyCharacters[id] = [];
            newState.buildingUnderConstruction =
              _.omit(newState.buildingUnderConstruction, id) || [];
            //update building
            //to not be considered as under construction
            //and having proper properties
            building.underConstruction = false;
            building.status = null;
          }
          //update flowField accordingly
          navigation.updateFlowField(
            newState.scene.meshes.filter(m => m.id !== 'shadowBuilding'),
            newState.flowField
          );
        })
        .value();
      break;
    case 'UPDATE_MESHES_POSITION':
      //update velocity moving meshes
      newState.scene.meshes
        .filter(mesh => mesh.targetPosition)
        .forEach(mesh => {
          const { position, targetPosition } = mesh;
          const tile = navigation.getTile(
            position,
            targetPosition,
            newState.flowField
          );
          const remainingPath = targetPosition.subtract(position);
          const isMovementDone =
            !tile || remainingPath.length() < 3 || tile.distance === 0;
          mesh.targetPosition = !isMovementDone ? targetPosition : undefined;
          setVelocity({
            mesh,
            direction: isMovementDone
              ? vector3(0, 0, 0)
              : vector3(tile.direction[0], 0, tile.direction[1]),
            speed: isMovementDone ? 0 : mesh.type.speed,
          });
          //Clean grids in flowField if movement is done
          // => do not need vectorField anymore
          const meshesWithSameTarget =
            isMovementDone &&
            newState.scene.meshes.filter(
              mesh => mesh.targetPosition === targetPosition
            );
          //if still mesh with same target, do not erase grids
          //erase otherwise
          if (isMovementDone && meshesWithSameTarget.length === 0) {
            navigation.cleanGrids(newState.flowField, targetPosition);
          }
        });
      break;
    case 'MOVE_GHOST_BUILDING':
      const gridPosition = navigation.getGridPosition(
        newState.flowField,
        action.value
      );
      if (!gridPosition) {
        return newState;
      }
      newState.currentPosition = gridPosition;
      const SB = newState.scene.getMeshByID('shadowBuilding');
      SB.position = vector3(
        gridPosition.meanX,
        action.value.y,
        gridPosition.meanZ
      );
      SB.material = gridPosition.available
        ? SB.standardMaterial
        : newState.scene.getMaterialByName('redMaterial');
      break;
    default:
      break;
  }
  return newState;
};

function updateWorkersAssignment(
  busyCharacters,
  meshesToReassign,
  idNewBuilding
) {
  //Remove selected meshes from their old assignment
  let updatedBusyCharacters = removeWorkersFromAssignment(
    _.cloneDeep(busyCharacters),
    meshesToReassign
  );
  //Add selected Meshes to idNewBuilding list of workers
  addWorkersToBuildingUnderConstruction(
    updatedBusyCharacters,
    idNewBuilding,
    meshesToReassign
  );
  return updatedBusyCharacters;
}

function updateSelectedMeshesTarget(
  selectedMeshes,
  targetPosition,
  flowField,
  scene
) {
  _.chain(selectedMeshes)
    .map(id => scene.getMeshByID(id))
    .filter(mesh => mesh.type.class === 'CHARACTER')
    .forEach(mesh => {
      //Clean grids if selected mesh already had a target
      if (mesh.targetPosition) {
        navigation.cleanGrids(flowField, mesh.targetPosition);
      }
      mesh.targetPosition = targetPosition;
    })
    .value();
  //calculate a new flowfield for the target
  navigation.updateTarget(targetPosition, flowField);
}

function removeWorkersFromAssignment(busyCharacters, workersToRemove) {
  return _.mapValues(busyCharacters, (characters, buildingId) => {
    //remove worker being moved from
    //construction list if
    //he was currently busy
    return characters.filter(worker => workersToRemove.includes(worker));
  });
}
function addWorkersToBuildingUnderConstruction(
  busyCharacters,
  idBuilding,
  workersToAdd
) {
  let currentWorkers = busyCharacters[idBuilding] || [];
  busyCharacters[idBuilding] = _.uniq([...currentWorkers, ...workersToAdd]);
}
