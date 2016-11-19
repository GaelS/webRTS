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