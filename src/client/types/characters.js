//label : name to display on button 
//buildings : type of buildings character can build
import * as buildings from './buildings.js';

/*
**FORMAT
** label : text on buttons 
** buildings : type of building this character can build
** cooldown : time between two creation in the same building
*/
export const CITIZEN = { 
    label :'CITIZEN',
    buildings : [ 
        buildings.HOUSE.label,
        buildings.BARRACK.label,
    ],
    cooldown : 2000,
    speed : 0.5,
    life : 50,
    attack : 10,
    class : 'CHARACTER',
    flowField : false,
    selectable : true,
}; 
export const SOLDIER = { 
    label :'SOLDIER',
    buildings : [],
    cooldown : 5000,
    speed : 1,
    life : 200,
    attack : 25,
    class : 'CHARACTER',
    flowField : false,
    selectable : true,
}; 