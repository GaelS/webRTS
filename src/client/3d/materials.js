import BABYLON from 'babylonjs';

function initMaterials(scene){
	
	scene.materialsBlack = new BABYLON.StandardMaterial("blackMaterial", scene);
    scene.materialsBlack.diffuseColor = new BABYLON.Color3(0.9, 0.9, 0.9);
    scene.materialsBlack.specularColor = new BABYLON.Color3(0, 0, 0);

    scene.materialsBlacker = new BABYLON.StandardMaterial("blackerMaterial", scene);
    scene.materialsBlacker.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    scene.materialsBlacker.specularColor = new BABYLON.Color3(0, 0, 0);

    scene.materialsWhite = new BABYLON.StandardMaterial("whiteMaterial", scene);
    scene.materialsWhite.diffuseColor = new BABYLON.Color3(1, 1, 1);
    scene.materialsWhite.specularColor = new BABYLON.Color3(0, 0, 0);

    scene.materialsGreen = new BABYLON.StandardMaterial("greenMaterial", scene);
    scene.materialsGreen.diffuseColor = new BABYLON.Color3(27 / 255, 207 / 255, 37 / 255);
    scene.materialsGreen.specularColor = new BABYLON.Color3(0, 0, 0);

    scene.materialsOrange = new BABYLON.StandardMaterial("orangeMaterial", scene);
    scene.materialsOrange.diffuseColor = new BABYLON.Color3(1, 165 / 255, 0);
    scene.materialsOrange.specularColor = new BABYLON.Color3(0, 0, 0);

    scene.materialsYellow = new BABYLON.StandardMaterial("yellowMaterial", scene);
    scene.materialsYellow.diffuseColor = new BABYLON.Color3(1, 1, 0);
    scene.materialsYellow.specularColor = new BABYLON.Color3(0, 0, 0);

    scene.materialsRed = new BABYLON.StandardMaterial("redMaterial", scene);
    scene.materialsRed.diffuseColor = new BABYLON.Color3(1, 0, 0);
    scene.materialsRed.specularColor = new BABYLON.Color3(0, 0, 0);

    scene.materialsBlue = new BABYLON.StandardMaterial("blueMaterial", scene);
    scene.materialsBlue.diffuseColor = new BABYLON.Color3(27 / 255, 37 / 255, 207 / 255);
    scene.materialsBlue.specularColor = new BABYLON.Color3(0, 0, 0);
};

function selectMeshes(scene, meshes){
    return scene.meshes
        .filter(e => meshes.indexOf(e.name) !== -1)
        .forEach( e => e.onSelect());
}
function deselectMeshes(scene, meshes){
    return scene.meshes
        .filter(e => meshes.indexOf(e.name) !== -1)
        .forEach( e => { console.log(e);e.onDeselect()});    
}
export default {
	initMaterials,
    selectMeshes,
    deselectMeshes,
}