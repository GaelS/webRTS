import _ from 'lodash';
import R from 'ramda';

export default class FlowField {
    constructor(groundMesh) {
        this.step = 20; //hardcoded for now
        this.xMax = groundMesh._maxX * 2 / this.step;
        this.zMax = groundMesh._maxZ * 2 / this.step;
        this.grid =  _.range(0, this.xMax ).map(ptX => {
            return  _.range(0, this.zMax ).map(ptZ => {
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
        //except for cell containing building
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
        let tilesToGoThrough = [];
        let distance = 1;
        //loop to go through
        //while not all elements in
        //this.grid are updated
        //with distance value from new target
        do {
            //loop through all current tiles selected
            //start with target tile clicked
            tilesTarget.forEach(tile => {
                _.chain( [ this.grid[ tile[0] ][ tile[1] ] ] )
                    .filter( cell => cell.distance !== 9999 )
                    .forEach( currentTile => {
                        //only update neighbours' cell
                        //for cell without buildings on it
                        let tilesToUpdate = _.compact( getNeighbours(tile[0], tile[1], this.xMax, this.zMax, this.step) );
                        updateDistance(this.grid, tilesToUpdate, distance);
                        tilesToGoThrough.push(tilesToUpdate);
                    } )
                    .value();
            } );
            //console.timeEnd('1')
            console.time('2');
            //Get all neightbours from current tile that needs 
            //to get distance value updated
            tilesTarget = _.chain(tilesToGoThrough)
                //tilesToGoThrough array of array 
                //=> needs to be flattened
                .flatten()
                //join tuple in string
                .map( tile => tile.join(',') )
                //remove duplicates
                .uniq()
                //get tuple of int back
                .map( tile => tile.split(',').map(e => parseInt(e)) )
                .value();

            tilesToGoThrough = [];
            distance = distance + 1;
            //console.timeEnd('2')            
        } while ( 
             /* Still going while not everything updated */
            _.chain(this.grid)
                .flatten()
                .filter(cell => !cell.updated)
                .value()
                .length !== 0 
        ); 
    }

    updateVectorField() {
        let newGrid = this.grid.map( ( row, i ) => {
            return row.map( ( cell, j ) => {
                let distance = cell.distance === 9999 ? -9999 : cell.distance;
                cell.direction = getDirection(i, j, distance, this.xMax, this.zMax, this.step, this.grid ); 
                return cell;
            } );    
        } );
        this.grid = newGrid;
    }
    getGrid() {
        return this.grid;
    }

    getTile( position ) {
        return this.grid[ getTileNumber( position.x, this.step ) ][ getTileNumber( position.z, this.step )];
    }
}

//utils
function checkPointInsideTile(tile, point, step) {
    return point.x < (tile.x + step) && point.x > tile.x &&
        point.z < (tile.z + step) && point.z > tile.z;
}

function getNeighbours(x, z, xMax, zMax, step) {
    // neighbours order
    // 1 8 7
    // 2   6
    // 3 4 5 
    const tooBigZ = z + 1 >= zMax;
    const tooSmallZ = z - 1 < 0;
    const tooBigX = x + 1 >= xMax;
    const tooSmallX = x - 1 < 0;
    return [
        !tooSmallX && !tooBigZ ? [ x - 1, z + 1 ] : null,
        !tooSmallX ? [ x - 1 , z ] : null,
        !tooSmallX && !tooSmallZ ? [ x - 1, z - 1 ] : null,
        !tooSmallZ ? [ x , z - 1 ] : null,
         !tooBigX && !tooSmallZ ? [ x + 1, z - 1 ] : null,
        !tooBigX ? [ x + 1 , z ] : null,
        !tooBigX && !tooBigZ ? [ x + 1 , z + 1 ] : null,
         !tooBigZ ? [ x , z + 1 ] : null,
    ];
}

function getGridNeighbours(x, z, xMax, zMax, grid) {
    let coords = getNeighbours(x ,z, xMax, zMax);
    return coords.map( coord => !!coord ? grid[ coord[0] ][ coord[1] ] : null )
};

function getMinimumNeighbour( x , z, currentDistance, xMax, zMax, step, grid ) {
    let neighbours = getGridNeighbours( x, z, xMax, zMax, grid );
    //Get neightboor with largest difference
    // => going toward target fastest
    return _.chain(neighbours)
        .map( ( cell, i ) => [ i + 1, !!cell ? cell.distance : -1 ] )
        .compact()
        .minBy( cell => cell[1] )
        .value()[0];
}
//Return vector direction for a cell
function getDirectionFromIndex( index ) {
    // neighbours order
    // 1 8 7
    // 2   6
    // 3 4 5 
    return {
        '1' : [ -1, 1 ],
        '2' : [ -1, 0 ],
        '3' : [ -1, -1 ],
        '4' : [ 0, -1 ],
        '5' : [ 1, -1 ],
        '6' : [ 1, 0 ],
        '7' : [ 1, 1 ],
        '8' : [ 0, 1 ],
    }[ index ] || [ 0, 0 ];
};

function getDirection( x, z, distance, xMax, zMax, step, grid ) {
    return distance === 0 ? [ 0, 0 ] : getDirectionFromIndex( getMinimumNeighbour( x, z, distance, xMax, zMax, step, grid ) );
};

function updateDistance(grid, tilesToUpdate, distance) {
    //update every selected cells 
    //with new distance value
    tilesToUpdate.forEach( tile => {
        let tileToUpdate = R.clone( grid[ tile[0] ][ tile[1] ] );
        grid[ tile[0] ][ tile[1] ].distance = !tileToUpdate.updated ? distance : tileToUpdate.distance;
        grid[ tile[0] ][ tile[1] ].updated = true;
    } );
};

function getTileNumber( point, step ){
    return Math.floor( point / step );
};