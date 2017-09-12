import initScene from './scene';
import initResources from './resources';
import * as building from './building';
import * as character from './character';
import * as rectangle2D from './rectangle2D';

export default {
  initScene,
  ...building,
  ...character,
  ...rectangle2D,
};
