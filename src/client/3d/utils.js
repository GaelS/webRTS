export const vector3 = (a,b,c) => {
	return new BABYLON.Vector3(a,b,c);
}
export const emptyFunc = () => {
	return function(){return;};
}

export const degToRad = (angle) => {
	return angle * Math.PI / 180;
}
export const radToDeg = (angle) => {
	return angle * 180/ Math.PI;
}