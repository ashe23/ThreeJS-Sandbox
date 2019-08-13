function OnDocumentLoad() {
    const canvas = document.querySelector('#c');
    const scene = new THREE.Scene();
    let mixer, clock, rtCamera, rtScene, rtRenderer, rtMixer;
    const CameraSettings = {
        fov: 50,
        aspect: 2,
        near: 0.1,
        far: 50
    }

    rtScene = new THREE.Scene();
    rtRenderer = new THREE.WebGLRenderTarget(4096, 4096);
    rtCamera = new THREE.PerspectiveCamera(CameraSettings.fov, 2, CameraSettings.near, CameraSettings.far);
    rtCamera.position.x = 2;
    rtCamera.position.y = 7;
    // camera.position.z = 2;
    rtCamera.lookAt(rtScene.position);
    rtScene.background = new THREE.Color('red');

    scene.add(new THREE.AxesHelper(10));
    // scene.add(new THREE.GridHelper(10, 10))
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.shadowMap.enabled = true;

    clock = new THREE.Clock();

    const camera = new THREE.PerspectiveCamera(CameraSettings.fov, CameraSettings.aspect, CameraSettings.near, CameraSettings.far);
    camera.position.y = 2;
    camera.position.x = 10;
    // camera.position.z = 2;
    camera.lookAt(scene.position);

    {
        // directional light
        const color = 0xFFFFFF;
        const intensity = 5;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 2);
        light.castShadow = true;
        light.shadow.mapSize.width = 512;  // default
        light.shadow.mapSize.height = 512; // default
        light.shadow.camera.near = 0.5;       // default
        light.shadow.camera.far = 500;     // default
        scene.add(light);

        const rtLight = new THREE.DirectionalLight(color, intensity);
        rtLight.position.set(-1, 2, 2);
        rtLight.castShadow = true;
        rtLight.shadow.mapSize.width = 512;  // default
        rtLight.shadow.mapSize.height = 512; // default
        rtLight.shadow.camera.near = 0.5;       // default
        rtLight.shadow.camera.far = 500;     // default
        rtScene.add(rtLight);
    }
    {
        // plane 
        const planeGeo = new THREE.PlaneGeometry(5, 8, 32);
        let planeMat = new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
            color: new THREE.Color('green')
        });
        let planeMesh = new THREE.Mesh(planeGeo, planeMat);
        planeMesh.rotation.x -= Math.PI / 2;
        planeMesh.receiveShadow = true;
        rtScene.add(planeMesh);

        // second plane
        const planeGeo2 = new THREE.PlaneGeometry(5, 8, 32);
        let planeMat2 = new THREE.MeshStandardMaterial({
            map: rtRenderer.texture
        });
        let planeMesh2 = new THREE.Mesh(planeGeo2, planeMat2);
        // planeMesh2.position.x = 5;
        planeMesh2.rotation.x -= Math.PI / 2;
        planeMesh2.rotation.z += Math.PI / 2;
        planeMesh2.receiveShadow = true;
        scene.add(planeMesh2);
    }
    {
        // 3d model
        let loader = new THREE.FBXLoader();
        loader.load('models/Idle.fbx', function (object) {

            mixer = new THREE.AnimationMixer(object);

            object.scale.set(0.01, 0.01, 0.01);
            object.rotation.y = Math.PI / 2;

            object.traverse(function (child) {

                if (child.isMesh) {

                    child.castShadow = true;

                }
            });

            console.log(object);
            object.animations.forEach(function (clip) {
                mixer.clipAction(clip).play();
            });
            rtScene.add(object);
        });

        loader.load('models/Idle.fbx', function (object) {

            mixer = new THREE.AnimationMixer(object);

            object.scale.set(0.01, 0.01, 0.01);
            object.rotation.y = Math.PI / 2;

            object.traverse(function (child) {

                if (child.isMesh) {

                    child.castShadow = true;

                }
            });

            object.animations.forEach(function (clip) {
                mixer.clipAction(clip).play();
            });
            scene.add(object);
        });
    }



    function render() {

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        if (mixer) mixer.update(clock.getDelta());
        // if (rtMixer) rtMixer.update(clock.getDelta());

        renderer.setRenderTarget(rtRenderer);
        renderer.render(rtScene, rtCamera);
        renderer.setRenderTarget(null);

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }
    requestAnimationFrame(render);
}



window.onload = OnDocumentLoad;