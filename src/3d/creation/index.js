import initScene from './scene.js';
import * as building from './building.js';
import * as character from './character.js';
import * as rectangle2D from './rectangle2D.js';

export default {
  initScene,
  ...building,
  ...character,
  ...rectangle2D,
};
