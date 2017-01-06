import _ from 'lodash';
import R from 'ramda';

export default class FlowField {
    constructor(groundMesh) {
        this.Xmin = groundMesh._minX;
        this.Zmin = groundMesh._minZ;
        this.Xmax = groundMesh._maxX;
        this.Zmax = groundMesh._maxZ;
        this.step = 50; //hardcoded for now
        this.xGrid = _.range(this.Xmin, this.Xmax, this.step);
        this.zGrid = _.range(this.Zmin, this.Zmax, this.step);
        let grid = this.xGrid.map(ptX => {
            return [this.zGrid.map(ptZ => {
                return {
                    x: ptX,
                    z: ptZ,
                    distance: -1,
                    updated: false,
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
        this.grid = updateDistance(this.grid, tilesTarget, 0);
        let tilesToGoThrough = [];
        let distance = 1;
        do {
            tilesTarget.forEach(tile => {
                let tilesToUpdate = getNeighbours(tile.x, tile.z, this.xMin, this.xMax, this.zMin, this.zMax, this.step);
                this.grid = updateDistance(this.grid, tilesToUpdate, distance);
                tilesToGoThrough.push( tilesToUpdate )
            } );

            tilesTarget = _.chain( tilesToGoThrough ).flatten().uniqWith(_.isEqual).value();
            tilesToGoThrough = [];
            distance = distance + 1;
        } while ( this.grid.filter( cell => !cell.updated ).length !== 0 /* Still going while not everything updated */);
        console.log(this.grid)
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
    } )
}