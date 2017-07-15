import FlowField from './FlowField';
import _ from 'lodash';
import BABYLON from 'babylonjs';

export const createFlowField = groundMesh => { return new FlowField(groundMesh) };
/**
 * Update flow field by
 * recalculating everything
 */
export const updateFlowField = ( meshes, flowField ) => {
    //Get minMax of each buildings
    const buildings = _.chain( meshes )
        .filter( mesh => !!mesh.type && mesh.type.flowField )
        .map( mesh => BABYLON.Mesh.MinMax( [ mesh ] ) )
        .value();
    //Get extend of every buildings
    const bExtends = _.map( buildings, minMax => {
        let xMin = minMax.min.x;
        let xMax = minMax.max.x;
        let zMin = minMax.min.z;
        let zMax = minMax.max.z;
        return [
            [ xMin, zMin ],
            [ xMin, zMax ],
            [ xMax, zMin ],
            [ xMax, zMax ],
        ];
    } );
    flowField.updateGrid( _.flatten( bExtends ) );
};

export const updateTarget = (target, flowField) => {
    flowField.updateDistanceValue(target);
    flowField.updateVectorField(target);
}

export const getDirection = (position, targetPosition, flowField ) => {
    return flowField.getTile( position, `${ targetPosition.x }${ targetPosition.z }` ).direction || [ -999, -999 ];
}

export const getDistance = (position, flowField ) => {
    return flowField.getTile( position ).distance || 999;
}

export const getTile = (position, target, flowField ) => {
    return flowField.getTile( position, target );
}

export const cleanGrids = ( flowField, targetToDelete ) => {
    return flowField.cleanGrid( targetToDelete );
}

export const getGridPosition = ( flowField, position ) => {
    if(!position) {
        return;
    }
    return flowField.getTileCenter( position );
}