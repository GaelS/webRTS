import _ from 'lodash';
import R from 'ramda';

export default class FlowField {
    constructor(groundMesh) {
        this.step = 30; //hardcoded for now
        this.xMax = groundMesh._maxX * 2 / this.step;
        this.zMax = groundMesh._maxZ * 2 / this.step;
        this.xGrid = _.range(0, this.xMax );
        this.zGrid = _.range(0, this.zMax );
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
            let xTile = getTileNumber( extend[0], this.step );
            let zTile = getTileNumber( extend[1], this.step );
            this.grid[ xTile ][ zTile ].distance = 9999;
            this.grid[ xTile ][ zTile ].updated = true;
         } );
    }
    /*
    ** Update distance values
    ** of the grid when
    ** new target is set
    */
    updateDistanceValue(target) {
        //reset grid 
        this.grid = this.grid.map( row => {
            return row.map( cell => {
                cell.updated = cell.distance === 9999 ? true : false;
                return cell;
            } );
        } );

        //set tile target to 0
        let targetTileX = getTileNumber( target.x, this.step );
        let targetTileZ = getTileNumber( target.z, this.step );
        this.grid[ targetTileX ][ targetTileZ].distance = 0;
        this.grid[ targetTileX ][ targetTileZ].updated = true;
        let tilesTarget = [ [ targetTileX, targetTileZ ] ]
        console.time('grid')
        //this.grid = updateDistance(this.grid, tilesTarget, 0);
        let tilesToGoThrough = [];
        let distance = 1;
        do {
            console.time('1')
            tilesTarget.forEach(tile => {
                let currentTileDistance = this.grid[ tile[0] ][ tile[1] ].distance;
                //only update cells without buildings
                if(currentTileDistance !== 9999){
                    let tilesToUpdate = getNeighbours(tile[0], tile[1], this.xMax, this.zMax, this.step);
                    this.grid = updateDistance(this.grid, tilesToUpdate, distance);
                    tilesToGoThrough.push(tilesToUpdate);
                }
            } );
            console.timeEnd('1')
            console.time('2')
            tilesTarget = _.chain(tilesToGoThrough)
                .flatten()
                .map( tile => tile.join(',') )
                .uniq()
                .map( tile => tile.split(',').map(e => parseInt(e)) )
                .value();

            tilesToGoThrough = [];
            distance = distance + 1;
            console.timeEnd('2')
        } while ( this.grid.filter(row =>  row.filter( cell => !cell.updated).length !== 0 ).length !== 0 /* Still going while not everything updated */);
    }

    updateVectorField() {
        let newGrid = this.grid.map( ( row, i ) => {
            return row.map( ( cell, j ) => {
                let distance = cell.distance === 9999 ? -9999 : cell.distance;
                if( cell.distance === 9999 ) return cell;

                let left = ( i - 1 ) < 0 ? 9999 : this.grid[ i - 1][ j ].distance - distance;
                let downLeft = ( i - 1 ) < 0 || ( j - 1 ) < 0 ? 9999 : this.grid[ i - 1][ j - 1 ].distance - distance;
                let right = ( i + 1 ) >= this.xMax ? 9999 : this.grid[ i + 1][ j ].distance - distance;
                let down = ( j - 1 ) < 0 ? 9999 : this.grid[ i ][ j - 1 ].distance - distance;
                let downRight = ( i + 1 ) >= this.xMax || ( j - 1 ) < 0 ? 9999 : this.grid[ i + 1][ j - 1 ].distance - distance;
                let top = ( j + 1 ) >= this.zMax ? 9999 : this.grid[ i ][ j + 1 ].distance - distance;
                let topLeft = ( i - 1 ) < 0 || ( j + 1 ) >= this.zMax ? 9999 : this.grid[ i - 1][ j + 1 ].distance - distance;
                let topRight = ( i + 1 ) >= this.xMax || ( j + 1 ) >= this.zMax ? 9999 : this.grid[ i + 1][ j + 1 ].distance - distance;
                              
                let minDistance = Math.min( left, right, top, down, topLeft, topRight, downLeft, downRight );
                
                let direction = null;
                switch( minDistance ){
                    case left : direction = [ -1, 0 ]; break;
                    case right : direction = [ 1, 0 ]; break;
                    case top : direction = [ 0, 1 ]; break;
                    case down : direction = [ 0, -1 ]; break;
                    case topLeft : direction = [ -1, 1 ]; break;
                    case topRight : direction = [ 1, 1 ]; break;
                    case downLeft : direction = [ -1, -1 ]; break;
                    case downRight : direction = [ 1, -1 ]; break;
                }
                if( direction[0] === 1 && direction[1] === 1){
                    console.log(topRight, right)
                }
                cell.direction = distance === 0 ? [ 0, 0 ] : direction
                return cell;
            } );    
        } );
        this.grid = newGrid;
        console.table(this.grid.map(row => row.map(cell => cell.distance)))
        console.table(this.grid.map(row => row.map(cell => cell.direction.join(','))))
    }
    getGrid() {
        return this.grid;
    }

    getTile( position ) {
        let tileX = getTileNumber( position.x, this.step );
        let tileZ = getTileNumber( position.z, this.step );
                let left = ( tileX - 1 ) < 0 ? 9999 : this.grid[ tileX - 1][ tileZ ].distance;
                let downLeft = ( tileX - 1 ) < 0 || ( tileZ - 1 ) < 0 ? 9999 : this.grid[ tileX - 1][ tileZ - 1 ].distance;
                let right = ( tileX + 1 ) >= this.xMax ? 9999 : this.grid[ tileX + 1][ tileZ ].distance;
                let downRight = ( tileX + 1 ) >= this.xMax || ( tileZ - 1 ) < 0 ? 9999 : this.grid[ tileX + 1][ tileZ - 1 ].distance;
                let top = ( tileZ + 1 ) >= this.zMax ? 9999 : this.grid[ tileX ][ tileZ + 1 ].distance;
                let topLeft = ( tileX - 1 ) < 0 || ( tileZ + 1 ) >= this.zMax ? 9999 : this.grid[ tileX - 1][ tileZ + 1 ].distance;
                let topRight = ( tileX + 1 ) > this.xMax || ( tileZ + 1 ) >= this.zMax ? 9999 : this.grid[ tileX + 1][ tileZ + 1 ].distance;
                              
                let down = ( tileZ - 1 ) < 0 ? 9999 : this.grid[ tileX ][ tileZ - 1 ].distance;
                let minDistance = Math.min( left, right, top, down );        
        let currentTile = this.grid[ tileX ][ tileZ ];
        let tile = null;
        switch( minDistance ) {
            case left : tile = this.grid[ tileX - 1][ tileZ ]; break;
            case right : tile = this.grid[ tileX + 1][ tileZ ]; break;
            case top : tile = this.grid[ tileX ][ tileZ + 1 ]; break;
            case down : tile = this.grid[ tileX - 1][ tileZ - 1 ]; break;
            case topLeft : tile = this.grid[ tileX - 1][ tileZ + 1 ]; break;
            case topRight : tile = this.grid[ tileX + 1][ tileZ + 1 ]; break;
            case downLeft : tile = this.grid[ tileX - 1][ tileZ - 1 ]; break;
            case downRight : tile = this.grid[ tileX + 1][ tileZ - 1 ]; break;
        }
        return currentTile.distance === 9999 ?  tile : currentTile;
    }
}

//utils
function checkPointInsideTile(tile, point, step) {
    return point.x < (tile.x + step) && point.x > tile.x &&
        point.z < (tile.z + step) && point.z > tile.z;
}

function getNeighbours(x, z, xMax, zMax, step) {
    const tooBigZ = z + 1 >= zMax;
    const tooSmallZ = z - 1 < 0;
    const tooBigX = x + 1 >= xMax;
    const tooSmallX = x - 1 < 0;
    return _.compact( [
        //bottom line
        !tooSmallX && !tooSmallZ ? [ x - 1, z - 1 ] : null,
        !tooSmallZ ? [ x, z - 1 ] : null,
        !tooBigX && !tooSmallZ ? [ x + 1, z - 1 ] : null,
        //middle line
        !tooSmallX ? [ x - 1, z ] : null,
        !tooBigX ? [ x + 1, z ] : null,
        //top line 
        !tooSmallX && !tooBigZ ? [ x - 1, z + 1 ] : null,
        !tooBigZ ? [ x, z + 1 ] : null,
        !tooBigX && !tooBigZ ? [ x + 1, z + 1 ] : null,
    ] );
}

function updateDistance(grid, tilesToUpdate, distance) {
    let newGrid =  grid;
    tilesToUpdate.forEach( tile => {
        let tileToUpdate = newGrid[ tile[0] ][ tile[1] ];
        if( !tileToUpdate.updated ) newGrid[ tile[0] ][ tile[1] ] = _.assign( newGrid[ tile[0] ][ tile[1] ], { distance, updated : true } );   
    } );

    return newGrid;
}

function getTileNumber( point, step ){
    return Math.floor( point / step );
}