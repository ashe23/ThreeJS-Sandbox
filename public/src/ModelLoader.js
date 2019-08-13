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
            // let loader = new THREE.GLTFLoader().setPath(path);

            // THREE.DRACOLoader.setDecoderPath( '/build/' );
            // loader.setDRACOLoader(new THREE.DRACOLoader());

            // THREE.DRACOLoader.getDecoderModule();

            // loader.load(model_name, function (gltf) {             
            //     gltf.scene.scale.copy(scale);
            //     gltf.scene.traverse(function (child) {

            //         if (child.isMesh) {
            //             child.material = material;
            //             child.material.side = THREE.DoubleSide;
            //             child.receiveShadow = true;
            //             child.castShadow = true;
            //         }

            //     });
                // if (gltf.scene === undefined) {
                //     reject(new Error('Cant Load Model'));

                // }
                // else {
                //     resolve(gltf);
                // }
            // });
            let loader = new THREE.FBXLoader();
            loader.load('models/Idle.fbx', function (object) {
                object.scale.copy(scale);
                console.log(object);

                object.traverse(function (child) {

                    if (child.isMesh) {

                        child.castShadow = true;
                        // child.receiveShadow = true;

                    }
                });
                if (object === undefined) {
                    reject(new Error('Cant Load Model'));

                }
                else {
                    resolve(object);
                }


            });
        });

        return myPromise;

    }
}