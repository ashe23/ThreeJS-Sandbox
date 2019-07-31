import { GameLoop } from './GameLoop.js';

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
        // GL.scene.add(ambient);

        var pointLight = new THREE.PointLight(0xffffff, 2);
        pointLight.position.set(200, 100, 500);
        pointLight.intensity = 1;
        pointLight.decay = 2;
        GL.scene.add(pointLight);


        let textureLoader = new THREE.TextureLoader();
        const TexturePath = "models/Textures/";
        const TextureName = 'StoneBricksBeige015_';
        const textureCOL = textureLoader.load(TexturePath + TextureName + 'COL_4k.jpg');
        const textureNRM = textureLoader.load(TexturePath + TextureName + 'NRM_4k.jpg');
        const textureAO = textureLoader.load(TexturePath + TextureName + 'AO_4k.jpg');
        const textureDISP = textureLoader.load(TexturePath + TextureName + 'DISP_4k.jpg');
        const textureGLOSS = textureLoader.load(TexturePath + TextureName + 'GLOSS_4k.jpg');



        textureCOL.encoding = THREE.sRGBEncoding;
        textureAO.encoding = THREE.sRGBEncoding;
        textureNRM.encoding = THREE.LinearEncoding;
        textureDISP.encoding = THREE.sRGBEncoding;
        textureGLOSS.encoding = THREE.sRGBEncoding;
        // textureCOL.anisotropy = 16;

        let material = new THREE.MeshStandardMaterial({
            map: textureCOL,
            normalMap: textureNRM,
            aoMap: textureAO,
            displacementMap: textureDISP,
            displacementScale: 5,
            metalnessMap: textureGLOSS,
            metalness: 0,
            roughness: 0.8
        });

        // var spotLight = new THREE.SpotLight( 0xffffff );
        // spotLight.position.set(0, 200, 300);
        // spotLight.castShadow = true;
        // GL.scene.add(spotLight);

        // var material = new THREE.MeshLambertMaterial({ color: 0x00ff00, envMap: refractionCube, refractionRatio: 0.95 });
        var loader = new THREE.GLTFLoader().setPath('models/');
        loader.load('cube.glb', function (gltf) {
            // gltf.scene.scale.set(0.1, 0.1, 0.1);
            console.log(gltf.scene);
            gltf.scene.traverse(function (child) {

                if (child.isMesh) {
                    child.material = material;
                }

            });

            GL.scene.add(gltf.scene);

        });
    }
    GL.init();
    GL.animate();
}

window.onload = OnDocumentLoad;