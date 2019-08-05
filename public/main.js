import { GameLoop } from './GameLoop.js';
import { ModelLoader } from './ModelLoader.js';
import { CubeMapLoader } from './CubeMapLoader.js';
import { TextureToSpriteLoader } from "./SpriteLoader.js";

function OnDocumentLoad() {
    let GL = new GameLoop();

    GL.initCallback = function () {
        // const TexturePath = "models/Textures/";
        // let urls = ['right', 'left', 'top', 'bottom', 'front', 'back'];
        // let textureLoader = new THREE.TextureLoader();
        // let bg = textureLoader.load(TexturePath + 'bg.jpg');

        let torusKnotGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
        let torusKnotMaterial = new THREE.MeshStandardMaterial({
            roughness: 0,
            transparent: false,
            flatShading: true,
            // side: THREE.DoubleSide
        });
        let torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);
        // torusKnot.position.y = 4;
        torusKnot.scale.set(0.5, 0.5, 0.5);
        // GL.scene.add( torusKnot );


        //lights
        let directionalLight = new THREE.DirectionalLight();
        directionalLight.position.set(-10, 10, 0);
        GL.scene.add(directionalLight);

        // light helper
        let lightHelper = new THREE.DirectionalLightHelper(directionalLight, 2);
        GL.scene.add(lightHelper);
        // var spotLight = new THREE.SpotLight(0xFFFFFF, 2);
        // spotLight.position.set(200, 250, 600);
        // spotLight.target.position.set(100, -50, 0);
        // spotLight.castShadow = true;
        // GL.scene.add(spotLight.target);
        // GL.scene.add(spotLight);

        // GL.scene.add(TextureToSpriteLoader.load('textures/test.png', new THREE.Vector3(10, 10, 1)));
        //Set up shadow properties for the spotLight
        // spotLight.shadow.mapSize.width = 512;  // default
        // spotLight.shadow.mapSize.height = 512; // default
        // spotLight.shadow.camera.near = 0.5;    // default
        // spotLight.shadow.camera.far = 15000;     // default

        // var ambient = new THREE.AmbientLight(0x404040);
        // GL.scene.add(ambient);

        // end ligths
        let RouletteModel = ModelLoader.load('models/', 'Dance.glb', torusKnotMaterial, new THREE.Vector3(1, 1, 1));
        RouletteModel.then((mesh) => {     
            GL.initializeAnimation(mesh);      
            GL.scene.add(mesh.scene);
        }, (error) => {
            console.log(error);
        });


        // let faceMaterial = new THREE.MeshStandardMaterial({ color: 0x0087E6, depthWrite: false });
        // let torus = new THREE.Mesh(new THREE.TorusBufferGeometry(20, 10, 16, 64), faceMaterial);
        // torus.rotation.x = -90 * Math.PI / 180;
        // torus.castShadow = true;
        // GL.scene.add(torus);


        // let geometry = new THREE.PlaneGeometry(1000, 1000, 32, 32);
        // var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xb69a77, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
        // let plane = new THREE.Mesh(geometry, planeMaterial);
        // plane.position.y -= 20;
        // plane.rotation.x = - Math.PI / 2;
        // plane.receiveShadow = true;
        // GL.scene.add(plane);


        GL.scene.background = new THREE.Color('#7e9ed9');





        // var pointLight = new THREE.PointLight(0xFFFFFF, 5);
        // pointLight.castShadow = true;
        // pointLight.position.set(20, 20, 0);
        // // pointLight.intensity = 2;
        // // pointLight.decay = 2;
        // GL.scene.add(pointLight);
        // GL.scene.add(new THREE.PointLightHelper(pointLight, 2));


        // const TextureName = 'WoodFlooring044_';
        // const textureCOL = textureLoader.load(TexturePath + TextureName + 'COL_4k.jpg');
        // const textureNRM = textureLoader.load(TexturePath + TextureName + 'NRM_4k.jpg');
        // // const textureAO = textureLoader.load(TexturePath + TextureName + 'AO_4k.jpg');
        // const textureDISP = textureLoader.load(TexturePath + TextureName + 'DISP_4k.jpg');
        // const textureGLOSS = textureLoader.load(TexturePath + TextureName + 'GLOSS_4k.jpg');



        // textureCOL.encoding = THREE.sRGBEncoding;
        // textureAO.encoding = THREE.sRGBEncoding;
        // textureNRM.encoding = THREE.LinearEncoding;
        // textureDISP.encoding = THREE.sRGBEncoding;
        // textureGLOSS.encoding = THREE.sRGBEncoding;
        // textureCOL.anisotropy = 16;

        // let material = new THREE.MeshStandardMaterial({
        //     map: textureCOL,
        //     normalMap: textureNRM,
        //     // aoMap: textureAO,
        //     // displacementMap: textureDISP,
        //     // displacementScale: 0.001,
        //     metalnessMap: textureGLOSS,
        //     metalness: 0,
        //     roughness: 0.8,
        //     // depthFunc: THREE.AlwaysDepth,
        //     depthTest: true,
        //     depthWrite: true
        // });
        // var meshMaterial = new THREE.MeshPhongMaterial({ color: 0x7777ff });

        // var loader = new THREE.GLTFLoader().setPath('models/');
        // loader.load('Susan.glb', function (gltf) {
        //     // let mesh = gltf.scene.children[0];
        //     // let meshGeo = mesh.children[0].geometry;
        //     // let threeMesh = new THREE.Mesh(meshGeo);
        //     // let helper = new THREE.VertexNormalsHelper(threeMesh, 0.2);
        //     GL.scene.add(gltf.scene);
        //     // GL.scene.add(helper);

        //     // console.log(mesh, threeMesh);
        // });

        // var FizzyText = function () {
        //     this.message = 'dat.gui';
        //     this.ss = 0.8;
        //     this.displayOutline = false;
        //     this.reload = function () { window.location.reload(); };
        //     this.background_color = '#7e9ed9';
        //     // Define render logic ...
        // };

        // var text = new FizzyText();
        // var gui = new dat.GUI();
        // gui.add(text, 'message');
        // gui.add(text, 'ss', -5, 5).onChange(function () {
        //     console.log('test');
        // });
        // gui.add(text, 'displayOutline');
        // gui.add(text, 'reload');
        // gui.addColor(text, 'background_color').onChange((value) => {
        //     GL.scene.background = new THREE.Color(value);
        // });

    }
    GL.animateCallback = function () {

    }
    GL.init();
    GL.animate();
}

window.onload = OnDocumentLoad;