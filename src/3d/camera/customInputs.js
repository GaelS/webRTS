import BABYLON from 'babylonjs';
import { vector3 } from '../utils.js';

export default class CustomInputs {
  constructor(camera) {
    this.keysUp = [38, 90];
    this.keysDown = [40, 83];
    this.keysLeft = [37, 81];
    this.keysRight = [39, 68];

    this.camera = camera;
    this._onKeyDown = null;
    this._onKeyUp = null;
    this._onLostFocus = null;
    this._keys = [];
  }

  attachControl(element, noPreventDefault) {
    element.tabIndex = 1;
    this._onKeyDown = evt => {
      if (
        this.keysUp.includes(evt.keyCode) ||
        this.keysDown.includes(evt.keyCode) ||
        this.keysLeft.includes(evt.keyCode) ||
        this.keysRight.includes(evt.keyCode)
      ) {
        var index = this._keys.indexOf(evt.keyCode);

        if (index === -1) {
          this._keys.push(evt.keyCode);
        }

        if (evt.preventDefault) {
          if (!noPreventDefault) {
            evt.preventDefault();
          }
        }
      }
    };

    this._onKeyUp = evt => {
      if (
        this.keysUp.includes(evt.keyCode) ||
        this.keysDown.includes(evt.keyCode) ||
        this.keysLeft.includes(evt.keyCode) ||
        this.keysRight.includes(evt.keyCode)
      ) {
        const index = this._keys.indexOf(evt.keyCode);

        if (index >= 0) {
          this._keys.splice(index, 1);
        }

        if (evt.preventDefault) {
          if (!noPreventDefault) {
            evt.preventDefault();
          }
        }
      }
    };

    this._onLostFocus = () => {
      this._keys = [];
    };

    element.addEventListener('keydown', this._onKeyDown, false);
    element.addEventListener('keyup', this._onKeyUp, false);
  }

  // element : HTML element
  detachControl(element) {
    if (element) {
      element.removeEventListener('keydown', this._onKeyDown);
      element.removeEventListener('keyup', this._onKeyUp);
    }

    this._keys = [];
    this._onKeyDown = null;
    this._onKeyUp = null;
    this._onLostFocus = null;
  }

  checkInputs() {
    const camera = this.camera;
    const cameraPos = camera.position;
    const targetPos = camera.target;
    const forward = targetPos.subtract(cameraPos).normalize();
    const left = BABYLON.Vector3.Cross(forward, camera.upVector).normalize();

    this._keys.forEach(keyCode => {
      const leftKey = this.keysLeft.includes(keyCode);
      const rightKey = this.keysRight.includes(keyCode);
      const upKey = this.keysUp.includes(keyCode);

      const sign = leftKey || upKey ? 1 : -1;
      const direction = leftKey || rightKey ? left : forward;

      const movement = vector3(
        sign * direction.x,
        0,
        sign * direction.z
      ).normalize();
      camera.setPosition(cameraPos.addInPlace(movement));
      camera.setTarget(targetPos.addInPlace(movement));
    });
  }

  getTypeName() {
    return 'CustomWebRTSKeyboard';
  }

  getSimpleName() {
    return 'CustomKeyboard';
  }
}
