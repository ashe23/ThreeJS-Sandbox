export class ModelLoader {
    static load(path, model_name, material, scale) {
        // todo check for valid scale and material
        if (scale === undefined) scale = new THREE.Vector3(1, 1, 1);
        if (material === undefined) material = new THREE.MeshBasicMaterial({
            color: 0xd3d3d3
        });
        // let model;
        // let loader = new THREE.GLTFLoader().setPath(path);
        // loader.load(model_name, function (gltf) {
        //     gltf.scene.traverse(function (child) {

        //         if (child.isMesh) {
        //             child.material = material;
        //         }

        //     });
        //     model = gltf.scene;
        //     // scene.add(gltf.scene);
        // });
        // return model;
        const myPromise = new Promise((resolve, reject) => {
            let loader = new THREE.GLTFLoader().setPath(path);
            loader.load(model_name, function (gltf) {
                gltf.scene.scale.copy(scale);
                gltf.scene.traverse(function (child) {

                    if (child.isMesh) {
                        child.material = material;
                    }

                });
                if (gltf.scene === undefined) {
                    reject(new Error('Cant Load Model'));

                }
                else {
                    resolve(gltf);
                }
            });
        });

        return myPromise;

    }
}