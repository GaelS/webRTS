export const initScene = dispatchEvents => {
  return {
    type: 'INIT',
    value: {
      dispatchEvents,
    },
  };
};

export const createGuy = (quantity, type) => {
  return {
    type: 'CREATE_GUY',
    value: {
      quantity,
      type,
    },
  };
};

export const launchGuyCreation = type => {
  return {
    type: 'LAUNCH_GUY_CREATION',
    value: {
      type,
    },
  };
};
export const characterIsCreated = buildingId => {
  return {
    type: 'CHARACTER_CREATED',
    value: {
      buildingId,
    },
  };
};
export const startBuildingCreation = type => {
  return {
    type: 'CLICK_ON_BUILDING_CREATION',
    value: {
      type,
    },
  };
};
export const creatingBuilding = (position, type) => {
  return {
    type: 'CREATING_BUILDING',
    value: {
      position,
      type,
    },
  };
};
export const updateUnderConstructionBuilding = () => {
  return {
    type: 'UPDATE_UNDER_CONSTRUCTION_BUILDING',
  };
};
export const endBuildingCreation = () => {
  return {
    type: 'SHADOW_HIDDEN',
  };
};
export const select = idsMesh => {
  return {
    type: 'START_SELECTION',
    value: idsMesh,
  };
};

export const setTarget = (target, mesh) => {
  return {
    type: 'SET_TARGET_CHARACTER',
    value: {
      target,
      mesh,
    },
  };
};

export const deselectAll = () => {
  return {
    type: 'DESELECT_ALL',
  };
};

export const updateMeshesPosition = () => {
  return {
    type: 'UPDATE_MESHES_POSITION',
  };
};

export const moveGhostBuilding = position => {
  return {
    type: 'MOVE_GHOST_BUILDING',
    value: position,
  };
};
