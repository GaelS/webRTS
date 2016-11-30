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
    //Friction to zero to drift on ground
    changePhysicsOptions( mesh, { friction : 0 } );
    console.log('debut',mesh.physicsImpostor._options)
    mesh.physicsImpostor.setLinearVelocity( direction );
};

export const addCallbackOnCollision = ( source, target, callback ) => {
    source.physicsImpostor.registerOnPhysicsCollide( target.physicsImpostor, function(main, collided) {
        console.log(main, main.object)
        callback( main, collided );
        //Friction back to 1 to stop movement
        changePhysicsOptions( source, { friction : 1 } );
        console.log('fin',source.physicsImpostor);
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