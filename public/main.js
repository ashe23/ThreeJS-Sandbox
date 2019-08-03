import { GameLoop } from './GameLoop.js';
import { ModelLoader } from './ModelLoader.js';
import { CubeMapLoader } from './CubeMapLoader.js';

function OnDocumentLoad() {
    let GL = new GameLoop();
    GL.initCallback = function () {
        let urls = ['right', 'left', 'top', 'bottom', 'front', 'back'];
        GL.scene.background = CubeMapLoader.draw('textures/', urls, '.jpg');

        //lights
        var ambient = new THREE.AmbientLight(0xffffff);
        GL.scene.add(ambient);

        var pointLight = new THREE.DirectionalLight( 0xFFFFFF, 0.3 );
        pointLight.castShadow = true;
        pointLight.position.set(200, 500, 0);
        pointLight.intensity = 2;
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
            // depthFunc: THREE.AlwaysDepth,
            depthTest: true,
            depthWrite: true
        });
        var meshMaterial = new THREE.MeshPhongMaterial({color: 0x7777ff});
        // let RouletteModel = ModelLoader.load('models/', 'Susan.glb', material, new THREE.Vector3(0.01, 0.01, 0.01));
        // RouletteModel.then((object) => {
        //     GL.scene.add(object.scene);
        // }, (error) => {
        //     console.log(error);
        // });

        var loader = new THREE.GLTFLoader().setPath('models/');
        loader.load('Susan.glb', function (gltf) {
            // let mesh = gltf.scene.children[0];
            // let meshGeo = mesh.children[0].geometry;
            // let threeMesh = new THREE.Mesh(meshGeo);
            // let helper = new THREE.VertexNormalsHelper(threeMesh, 0.2);
            GL.scene.add(gltf.scene);
            // GL.scene.add(helper);

            // console.log(mesh, threeMesh);
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