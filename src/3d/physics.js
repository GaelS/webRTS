import BABYLON from 'babylonjs';
import { vector3 } from './utils.js';

export const addPhysicsProps = ( mesh, impostor, mass, restitution, friction, scene ) => {
	let options = { 
            mass,
            restitution,
            friction,
    };
    mesh.physicsImpostor = new BABYLON.PhysicsImpostor( mesh, impostor, options, scene );
};

export const setVelocity = ( mesh, direction, speed ) => {
    direction.x = direction.x * speed * 10;
    direction.z = direction.z * speed * 10;
    mesh.physicsImpostor.setLinearVelocity( direction );
};

export const addCallbackOnCollision = ( source, target, callback ) => {
    source.physicsImpostor.registerOnPhysicsCollide( target.physicsImpostor, function(main, collided) {
        callback( main, collided );
    } );
};

export const changePhysicsOptions = (mesh, options) => {
    let { mass, restitution, friction } = options;
    let currentOptions = mesh.physicsImpostor._options;
    mesh.physicsImpostor._options = {
        mass : ( !!parseInt(mass) || mass === 0 ) ? mass : currentOptions.mass,
        restitution : ( !!parseInt(restitution) || restitution === 0 ) ? restitution : currentOptions.restitution,
        friction : ( !!parseInt(friction) || friction === 0 ) ? friction : currentOptions.friction,
    };
}