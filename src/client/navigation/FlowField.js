import _ from 'lodash';
import R from 'ramda';

export default class FlowField {
    constructor(groundMesh) {
        this.Xmin = groundMesh._minX;
        this.Zmin = groundMesh._minZ;
        this.Xmax = groundMesh._maxX;
        this.Zmax = groundMesh._maxZ;
        this.step = 40; //hardcoded for now
        this.xGrid = _.range(this.Xmin, this.Xmax, this.step);
        this.zGrid = _.range(this.Zmin, this.Zmax, this.step);
        let grid = this.xGrid.map(ptX => {
            return [this.zGrid.map(ptZ => {
                return {
                    x: ptX,
                    z: ptZ,
                    distance: -1,
                    updated: false,
                    vector : [ 0,0 ] //x, z components
                };
            })];
        });
        this.grid = _.flattenDeep(grid);
    }
    /*
    **Update grid when a new building is added
    */
    updateGrid(buildingsExtend) {

        let newGrid = _.map(this.grid, tile => {
            let tileOccupied = _.chain(buildingsExtend)
                .filter(extend => {
                    //check if a building is inside
                    //current tile
                    return checkPointInsideTile(tile, extend, this.step);
                })
                .compact()
                .value()
                .length !== 0;
            if (tileOccupied) tile['distance'] = -2;
            return tile;
        });
        this.grid = R.clone(newGrid);
    }
    /*
    ** Update distance values
    ** of the grid when
    ** new target is set
    */
    updateDistanceValue(target) {
        //reset grid 
        this.grid.forEach(cell => {
            cell.updated = (cell.distance === -2) ? true : false;
            return cell;
        });

        //Find tile where target is
        let tilesTarget = _.filter(this.grid, tile => checkPointInsideTile(tile, target, this.step));
        //set tile target to 0
        console.time('grid')
        this.grid = updateDistance(this.grid, tilesTarget, 0);
        let tilesToGoThrough = [];
        let distance = 1;
        do {
            console.time('1')
            tilesTarget.forEach(tile => {
                let tilesToUpdate = getNeighbours(tile.x, tile.z, this.xMin, this.xMax, this.zMin, this.zMax, this.step);
                this.grid = updateDistance(this.grid, tilesToUpdate, distance);
                tilesToGoThrough.push(tilesToUpdate)
            });
            console.timeEnd('1')
            console.time('2')
            tilesTarget = _.chain(tilesToGoThrough)
                .flatten()
                .uniqWith(_.isEqual)
                //delete node with distance -2
                .filter(tile => !!this.grid.filter(cell => {
                    return (tile.x === cell.x && tile.z === cell.z && cell.distance !== -2)[0]
                }))
                .value();
            tilesToGoThrough = [];
            distance = distance + 1;
            console.timeEnd('2')
        } while (this.grid.filter(cell => !cell.updated).length !== 0 /* Still going while not everything updated */);
    }
    
    updateVectorField() {
        let newGrid = this.grid.map( cell => {
            let { x, y, distance } = cell;
            let left = _.find( this. grid, { x :cell.x - this.step, z : cell.z} );
            let right =  _.find( this. grid, { x :cell.x + this.step, z : cell.z} );
            let top = _.find( this. grid, { x :cell.x, z : cell.z + this.step } );
            let down =  _.find( this. grid, { x :cell.x, z : cell.z - this.step } );
            return {
                x : cell.x,
                z : cell.z,
                distance : distance,
                updated : false,
                vector : [
                    ( !!left ? left.distance : distance) - (!!right ? right.distance : distance),
                    (!!top ? top.distance : distance) - (!!down ? down.distance : distance),
                 ]
            }
        } );
        this.grid = newGrid;
    }
    getGrid() {
        return this.grid;
    }
}

//utils
function checkPointInsideTile(tile, point, step) {
    return point.x < (tile.x + step) && point.x > tile.x &&
        point.z < (tile.z + step) && point.z > tile.z;
}

function getNeighbours(x, z, xMin, xMax, zMin, zMax, step) {
    const tooBigZ = z + step >= zMax;
    const tooSmallZ = z - step <= zMin;
    const tooBigX = x + step >= xMax;
    const tooSmallX = x - step <= xMin;
    return _.compact([
        //bottom line
        !tooSmallZ ? { x: x - step, z: z - step } : null,
        !tooSmallZ ? { x, z: z - step } : null,
        !tooBigX ? { x: x + step, z: z - step } : null,
        //middle line
        !tooSmallX ? { x: x - step, z } : null,
        !tooBigX ? { x: x + step, z } : null,
        //top line 
        !tooSmallX && !tooBigZ ? { x: x - step, z: z + step } : null,
        !tooBigZ ? { x, z: z + step } : null,
        !tooBigX && !tooBigZ ? { x: x + step, z: z + step } : null,
    ]);
}

function updateDistance(grid, tilesToUpdate, distance) {
    return grid.map(cell => {
        let e = tilesToUpdate.filter(tileToUpdate => {
            return (tileToUpdate.x === cell.x && tileToUpdate.z === cell.z && !cell.updated)
        } );
        return {
            x: cell.x,
            z: cell.z,
            distance: !!e[0] ? distance : cell.distance,
            updated: !!e[0] || cell.updated,
        }
    })
}