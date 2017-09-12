import BABYLON from 'babylonjs';
function addPhysicsProps({
  mesh,
  impostor,
  mass,
  restitution,
  friction,
  scene,
}) {
  const options = {
    mass,
    restitution,
    friction,
  };
  mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
    mesh,
    impostor,
    options,
    scene
  );
}

function setVelocity({ mesh, direction, speed }) {
  const { x, z, ...others } = direction;
  const updatedDirection = { x: x * speed * 10, z: z * speed * 10, ...others };
  mesh.physicsImpostor.setLinearVelocity(updatedDirection);
}

function addCallbackOnCollision({ source, target, callback }) {
  source.physicsImpostor.registerOnPhysicsCollide(
    target.physicsImpostor,
    function(main, collided) {
      callback(main, collided);
    }
  );
}

function changePhysicsOptions({ mesh, options }) {
  const { mass, restitution, friction } = options;
  const currentOptions = mesh.physicsImpostor._options;
  mesh.physicsImpostor._options = {
    mass: parseInt(mass, 10) ? mass : currentOptions.mass,
    restitution: parseInt(restitution, 10)
      ? restitution
      : currentOptions.restitution,
    friction: parseInt(friction, 10) ? friction : currentOptions.friction,
  };
}

export {
  addCallbackOnCollision,
  addPhysicsProps,
  setVelocity,
  changePhysicsOptions,
};
