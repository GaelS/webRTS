import FlowField from './FlowField';
import _ from 'lodash';

export const createFlowField = groundMesh => { return new FlowField(groundMesh) };
/**
 * Update flow field by
 * recalculating everything
 */
export const updateFlowField = ( scene, flowField ) => {
    //Get minMax of each buildings
    const buildings = _.chain( scene.meshes )
        .filter( mesh => !!mesh.type && mesh.type.flowField )
        .map( mesh => BABYLON.Mesh.MinMax( [ mesh ] ) )
        .value();
    //Get extend of every buildings
    const bExtends = _.map( buildings, minMax => {
        let xMin = minMax.min.x;
        let xMax = minMax.max.x;
        let zMin = minMax.min.z;
        let zMax = minMax.max.z;
        
    return { x : (xMin + xMax) /2, z : (zMin + zMax) /2 };
            /*[ xMin, zMin ],
            [ xMin, zMax ],
            [ xMax, zMin ],
            [ xMax, zMax ],
        ]; */
    } );
    flowField.updateGrid( bExtends );

};

export const updateTarget = (target, flowField) => {
    console.log(target)
    flowField.updateDistanceValue(target);
    flowField.updateVectorField(target);
}