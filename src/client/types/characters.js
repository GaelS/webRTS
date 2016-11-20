//label : name to display on button 
//buildings : type of buildings character can build
import * as buildings from './buildings.js';

export const CITIZEN = { 
    label :'CITIZEN',
    buildings : [ 
        buildings.HOUSE.label,
        buildings.BARRACK.label,
    ],
}; 
export const SOLDIER = { 
    label :'SOLDIER',
    buildings : [],
}; 