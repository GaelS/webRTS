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

export const checkPointInsidePolygon = ( A, B, C, D, point ) => {
	//NEXT LINE
	//TO BE SET OUTSIDE FUNCTION TO BE CALCULATED ONCE
	const [AB, BC, CD, DA ] = [ B.subtract(A), C.subtract(B), D.subtract(C), A.subtract(D) ];
	const [AP,BP,CP,DP] = [A,B,C,D].map( rectangleEdge => point.subtract( rectangleEdge ) );
	//filter if there is a Y vector < 0 which would mean point is outside rectangle
	return _.zip( [AB, BC, CD, DA ], [AP,BP,CP,DP] )
			.map( ( [point1, point2] ) => BABYLON.Vector3.Cross(point1, point2).y )
			.filter(vertical => vertical < 0)
			.length === 0;
};