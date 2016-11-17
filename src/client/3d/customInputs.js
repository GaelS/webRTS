import { vector3 } from './utils.js';
export default class CustomInputs {
        
		constructor(camera){
			this.keysUp = [38];
			this.keysDown = [40];
			this.keysLeft = [37];
			this.keysRight = [39];

			this.camera = camera;
			this._onKeyDown = null;
			this._onKeyUp = null;
			this._onLostFocus = null;
			this._keys = [];	
		}

		attachControl(element, noPreventDefault) {
            element.tabIndex = 1;
            this._onKeyDown = evt => {

                if (this.keysUp.indexOf(evt.keyCode) !== -1 ||
                    this.keysDown.indexOf(evt.keyCode) !== -1 ||
                    this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                    this.keysRight.indexOf(evt.keyCode) !== -1) {
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

                if (this.keysUp.indexOf(evt.keyCode) !== -1 ||
                    this.keysDown.indexOf(evt.keyCode) !== -1 ||
                    this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                    this.keysRight.indexOf(evt.keyCode) !== -1) {
                    var index = this._keys.indexOf(evt.keyCode);

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

            element.addEventListener("keydown", this._onKeyDown, false);
            element.addEventListener("keyup", this._onKeyUp, false);
        }
		
		// element : HTML element
        detachControl(element) {
            if (element) {
                element.removeEventListener("keydown", this._onKeyDown);
                element.removeEventListener("keyup", this._onKeyUp);
            }

            this._keys = [];
            this._onKeyDown = null;
            this._onKeyUp = null;
            this._onLostFocus = null;
        }

        checkInputs() {
			let camera = this.camera;

			let cameraPos = camera.position;
			let targetPos = camera.target;
			
			let fwd = targetPos.subtract( cameraPos ).normalize();
			let left = BABYLON.Vector3.Cross( fwd, camera.upVector ).normalize();
			for (var index = 0; index < this._keys.length; index++) {
				
				let keyCode = this._keys[index];
				let leftKey = this.keysLeft.indexOf(keyCode) !== -1;
				let rightKey = this.keysRight.indexOf(keyCode) !== -1;
				let upKey = this.keysUp.indexOf(keyCode) !== -1;
				let downKey = this.keysDown.indexOf(keyCode) !== -1;
            	
				if (leftKey || rightKey) {
					let factor = leftKey ? 1 : -1;
					let mvt = vector3( factor * left.x, 0, factor * left.z ).normalize();
					camera.setPosition( cameraPos.addInPlace( mvt ) ); 
                    camera.setTarget( targetPos.addInPlace( mvt ) );
                } else if ( upKey || downKey ) {
					let factor = upKey ? 1 : -1;
					let mvt = vector3( factor * fwd.x, 0, factor * fwd.z ).normalize();
					camera.setPosition( cameraPos.addInPlace( mvt ) ); 
                    camera.setTarget( targetPos.addInPlace( mvt ) ); 
                }
            }
        }

        getTypeName(){
            return "CustomWebRTSKeyboard";
        }
        
        getSimpleName(){
            return "CustomKeyboard";
        }
}