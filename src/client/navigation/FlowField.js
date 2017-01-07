import _ from 'lodash';
import R from 'ramda';

export default class FlowField {
    constructor(groundMesh) {
        this.step = 50; //hardcoded for now
        this.Xmax = groundMesh._maxX / this.step;
        this.Zmax = groundMesh._maxZ / this.step;
        this.xGrid = _.range(0, this.Xmax);
        this.zGrid = _.range(0, this.Zmax);
        this.grid = this.xGrid.map(ptX => {
            return this.zGrid.map(ptZ => {
                return {
                    distance: -1,
                    updated: false,
                    direction : [ 0,0 ] //x, z components
                };
            } );
        } );
    }
    /*
    **Update grid when a new building is added
    */
    updateGrid(buildingsExtend) {
        buildingsExtend.forEach( extend => {
            let xTile = getTileNumber( extend[0], step );
            let zTile = getTileNumber( extend[0], step );
            this.grid[ xTile ][ zTile ].distance = -2;
         } );
    }
    /*
    ** Update distance values
    ** of the grid when
    ** new target is set
    */
    updateDistanceValue(target) {
        //reset grid 
        this.grid.forEach( cell => {
            cell.updated = (cell.distance === -2) ? true : false;
            return cell;
        } );

        //set tile target to 0
        let targetTileX = getTileNumber( target.x );
        let targetTileZ = getTileNumber( target.z );
        
        this.grid[ targetTileX ][ targetTileZ].distance = 0;
        //let tilesTarget = _.filter(this.grid, tile => checkPointInsideTile(tile, target, this.step));
        console.time('grid')
        //this.grid = updateDistance(this.grid, tilesTarget, 0);
        let tilesToGoThrough = [];
        let distance = 1;
        do {
            console.time('1')
            tilesTarget.forEach(tile => {
                let tilesToUpdate = getNeighbours(tile.x, tile.z, this.xMin, this.xMax, this.zMin, this.zMax, this.step);
                this.grid = updateDistance(this.grid, tilesToUpdate, distance);
                tilesToGoThrough.push(tilesToUpdate);
            } );
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
            console.log('distance', distance)
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
                direction : [
                    ( !!left ? left.distance : distance) - (!!right ? right.distance : distance),
                    -(!!top ? top.distance : distance) + (!!down ? down.distance : distance),
                 ]
            }
        } );
        this.grid = newGrid;
    }
    getGrid() {
        return this.grid;
    }

    getTile( position ) {
        return _.filter(this.grid, tile => checkPointInsideTile(tile, position, this.step))[0];
    }
}

//utils
function checkPointInsideTile(tile, point, step) {
    return point.x < (tile.x + step) && point.x > tile.x &&
        point.z < (tile.z + step) && point.z > tile.z;
}

function getNeighbours(x, z, xMin, xMax, zMin, zMax, step) {
    const tooBigZ = z + 1 > zMax;
    const tooSmallZ = z - 1 < 0;
    const tooBigX = x + 1 > xMax;
    const tooSmallX = x - 1 < 0;
    return _.compact([
        //bottom line
        !tooSmallZ ? [ x - 1, z - 1 ] : null,
        !tooSmallZ ? [ x, z - 1 ] : null,
        !tooBigX ? [ x + 1, z - 1 ] : null,
        //middle line
        !tooSmallX ? [ x - 1, z ] : null,
        !tooBigX ? [ x + 1, z ] : null,
        //top line 
        !tooSmallX && !tooBigZ ? [ x - 1, z + 1 ] : null,
        !tooBigZ ? [ x, z + 1 ] : null,
        !tooBigX && !tooBigZ ? [ x + 1, z + 1 ] : null,
    ]);
}

function updateDistance(grid, tilesToUpdate, distance) {
    let newGrid = R.clone( grid );
    tilesToUpdate.forEach( tile => {
        let tileToUpdate = newGrid[ tile[0] ][ tile[1] ];
        if( !tilesToUpdate.updated ) tile
    } );
    /*return grid.map(cell => {
        let e = tilesToUpdate.filter(tileToUpdate => {
            return (tileToUpdate.x === cell.x && tileToUpdate.z === cell.z && !cell.updated)
        } );
        return {
            x: cell.x,
            z: cell.z,
            distance: !!e[0] ? distance : cell.distance,
            updated: !!e[0] || cell.updated,
        }
    })*/
}

function getTileNumber( point, step ){
    return Math.floor( point/this.step );
}