import _ from 'lodash';
import R from 'ramda';

export default class FlowField {
    constructor( groundMesh ) {
        this.Xmin = groundMesh._minX;
        this.Zmin = groundMesh._minZ;
        this.Xmax = groundMesh._maxX;
        this.Zmax = groundMesh._maxZ;
        this.step = 100; //hardcoded for now
        this.xGrid = _.range( this.Xmin, this.Xmax, this.step );
        this.zGrid = _.range( this.Zmin, this.Zmax, this.step );
        let grid = this.xGrid.map( ptX => {
            return [ this.zGrid.map( ptZ => {
                //bottom left to top left
                // 3 ----- 2 
                // |       |
                // |       |
                // 0 ----- 1
                return { 
                    x : ptX,
                    z : ptZ,
                    //0 : vector3( ptX, 0, ptZ ),
                    //1 : vector3( ptX + this.step, 0, ptZ ),
                    //2 : vector3( ptX + this.step, 0, ptZ + this.step ),
                    //3 : vector3( ptX, 0, ptZ + this.step ),
                    distance : -1,
                };
            } ) ];
        } );
        this.grid = _.flattenDeep(grid);
    }
    
    updateGrid( buildingsExtend ) {
        let newGrid = _.map(this.grid, tile => {
            let tileOccupied = _.chain( buildingsExtend )
                .filter( extend => {
                    //check if a building is inside
                    //current tile
                    return extend.x < tile.x + this.step && extend.x > tile.x && 
                        extend.z < tile.z + this.step && extend.z > tile.z;
                } )
                .compact()
                .value()
                .length !== 0;
            if( tileOccupied ) tile[ 'distance' ] = -2;
            return tile; 
        } );
        this.grid = R.clone( newGrid );
        console.log(this.grid.filter(e => e.distance === -2))
    }
    getGrid(){
        return this.grid;
    }
}