export const initScene = (dispatchEvents) => {
	return {
		type : 'INIT',
		value : {
			dispatchEvents,
		},
	};
};

export const createGuy = ( qty, type ) => {
	return {
		type : 'CREATE_GUY',
		value : {
			qty,
			type,
		 },
	};
};

export const launchGuyCreation = ( type ) => {
	return {
		type : 'LAUNCH_GUY_CREATION',
		value : {
			type,
		},
	};
};
export const characterIsCreated = ( buildingId ) => {
	return {
		type : 'CHARACTER_CREATED',
		value : {
			buildingId,
		},
	};
};
export const startBuildingCreation = ( type ) => {
	return {
		type : 'CLICK_ON_BUILDING_CREATION',
		value : {
			type,
		},
	};
};
export const creatingBuilding = ( position, type ) => {
	return {
		type : 'CREATING_BUILDING',
		value : {
			position,
			type, 
		},
	};
};
export const buildingIsDone = ( id ) => {
	return {
		type : 'BUILDING_IS_DONE',
		value : {
			id,
		},
	};
};
export const updateUnderConstructionBuilding = () => {
	return {
			type : 'UPDATE_UNDER_CONSTRUCTION_BUILDING',
			value : null,
		};
};
export const endBuildingCreation = () => {
	return {
		type : 'SHADOW_HIDDEN',
		value : null,
	};
}
export const select = (idsMesh) => {
	return {
		type : 'START_SELECTION',
		value : idsMesh,
	};
};

export const setTarget = ( target, buildingId ) => {
	return {
		type : 'SET_TARGET_CHARACTER',
		value : {
			target,
			buildingId,
		},
	};
}

export const deselectAll = () => {
	return {
		type : 'DESELECT_ALL',
		value : null,
	};
};