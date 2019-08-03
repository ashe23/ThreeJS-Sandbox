import { GameLoop } from './GameLoop.js';
import { ModelLoader } from './ModelLoader.js';

function OnDocumentLoad() {
    let GL = new GameLoop();
    GL.initCallback = function () {
        var path = 'textures/';
        var format = '.jpg';
        var urls = [
            path + 'right' + format, path + 'left' + format,
            path + 'top' + format, path + 'bottom' + format,
            path + 'front' + format, path + 'back' + format
        ];
        var reflectionCube = new THREE.CubeTextureLoader().load(urls);
        reflectionCube.format = THREE.RGBFormat;

        var refractionCube = new THREE.CubeTextureLoader().load(urls);
        refractionCube.mapping = THREE.CubeRefractionMapping;
        refractionCube.format = THREE.RGBFormat;

        GL.scene.background = reflectionCube;

        //lights
        var ambient = new THREE.AmbientLight(0x404040);
        GL.scene.add(ambient);

        var pointLight = new THREE.PointLight(0xffffff, 2);
        pointLight.position.set(200, 100, 500);
        pointLight.intensity = 1;
        pointLight.decay = 2;
        GL.scene.add(pointLight);


        let textureLoader = new THREE.TextureLoader();
        const TexturePath = "models/Textures/";
        const TextureName = 'WoodFlooring044_';
        const textureCOL = textureLoader.load(TexturePath + TextureName + 'COL_4k.jpg');
        const textureNRM = textureLoader.load(TexturePath + TextureName + 'NRM_4k.jpg');
        // const textureAO = textureLoader.load(TexturePath + TextureName + 'AO_4k.jpg');
        const textureDISP = textureLoader.load(TexturePath + TextureName + 'DISP_4k.jpg');
        const textureGLOSS = textureLoader.load(TexturePath + TextureName + 'GLOSS_4k.jpg');



        textureCOL.encoding = THREE.sRGBEncoding;
        // textureAO.encoding = THREE.sRGBEncoding;
        textureNRM.encoding = THREE.LinearEncoding;
        textureDISP.encoding = THREE.sRGBEncoding;
        textureGLOSS.encoding = THREE.sRGBEncoding;
        // textureCOL.anisotropy = 16;

        let material = new THREE.MeshStandardMaterial({
            map: textureCOL,
            normalMap: textureNRM,
            // aoMap: textureAO,
            // displacementMap: textureDISP,
            // displacementScale: 0.001,
            metalnessMap: textureGLOSS,
            metalness: 0,
            roughness: 0.8,
            side: THREE.DoubleSide,
            depthFunc: THREE.AlwaysDepth,
            depthTest: true,
            depthWrite: true
        });

        // var spotLight = new THREE.SpotLight( 0xffffff );
        // spotLight.position.set(0, 200, 300);
        // spotLight.castShadow = true;
        // GL.scene.add(spotLight );


        // let helper = new THREE.FaceNormalsHelper(box, 2);
        // GL.vnh = helper;
        // GL.scene.add(box);
        // GL.scene.add(GL.vnh);
        // var material = new THREE.MeshLambertMaterial({ color: 0x00ff00, envMap: refractionCube, refractionRatio: 0.95 });
        // let CubeModel = ModelLoader.load('models/', 'Roulette.glb', material);
        // CubeModel.then((mesh) => {
        //     let threeMesh = mesh.children[0].children[0];
        //     console.log(threeMesh);
        // let helper = new THREE.FaceNormalsHelper(threeMesh, 2);
        // GL.vnh = helper;
        // GL.scene.add(mesh);
        // GL.scene.add(GL.vnh);
        //     // GL.vnh = new THREE.FaceNormalsHelper( mesh.children[0].children[0], 5 );
        //     // GL.scene.add(GL.vnh);
        // }, (error) => {
        //     console.log(error);
        // });

        // let RouletteModel = ModelLoader.load('models/', 'Roulette.glb', undefined, new THREE.Vector3(0.01, 0.01, 0.01));
        // RouletteModel.then((mesh) => {
        //     GL.scene.add(mesh);
        // }, (error) => {
        //     console.log(error);
        // });

        var loader = new THREE.GLTFLoader().setPath('models/');
        loader.load('Roulette.glb', function (gltf) {
            let mesh = gltf.scene.children[0];
            let meshGeo = mesh.children[0].geometry;
            let threeMesh = new THREE.Mesh(meshGeo, material);
            // let helper = new THREE.VertexNormalsHelper(threeMesh, 10);
            GL.scene.add(gltf.scene);
            // GL.scene.add(helper);

            console.log(mesh, threeMesh);
        });

        var FizzyText = function () {
            this.message = 'dat.gui';
            this.ss = 0.8;
            this.displayOutline = false;
            this.explode = function () { };
            // Define render logic ...
        };

        var text = new FizzyText();
        var gui = new dat.GUI();
        gui.add(text, 'message');
        gui.add(text, 'ss', -5, 5).onChange(function () {
            console.log('test');
        });
        gui.add(text, 'displayOutline');
        gui.add(text, 'explode');

    }
    GL.init();
    GL.animate();
}

window.onload = OnDocumentLoad;