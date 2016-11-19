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
export const startBuildingCreation = () => {
	return {
		type : 'CLICK_ON_BUILDING_CREATION',
		value : null,
	};
};
export const creatingBuilding = ( position,type ) => {
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

export const moveSelection = (x,z) => {
	return {
		type : 'MOVE_SELECTION',
		value : {
			x,
			z,
		},
	};
}

export const deselectAll = () => {
	return {
		type : 'DESELECT_ALL',
		value : null,
	};
};