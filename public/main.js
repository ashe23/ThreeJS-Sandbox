import { GameLoop } from './GameLoop.js';
import { ModelLoader } from './ModelLoader.js';
import { CubeMapLoader } from './CubeMapLoader.js';
import { TextureToSpriteLoader } from "./SpriteLoader.js";

function OnDocumentLoad() {

    let GL = new GameLoop();
    let roulette, renderTarget, rtScene, rtCamera, mirrorCubeCamera;
    const rtWidth = 512;
    const rtHeight = 512;
    GL.initCallback = () => {

        renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight);
        rtCamera = new THREE.PerspectiveCamera(60, rtWidth / rtHeight, 0.1, 5000);
        rtCamera.position.z = 2;
        rtScene = new THREE.Scene();
        rtScene.background = new THREE.Color('red');
        {
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(-1, 2, 4);
            rtScene.add(light);

            const boxWidth = 1;
            const boxHeight = 1;
            const boxDepth = 1;
            const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
            const material = new THREE.MeshPhongMaterial({ color });
            const cube = new THREE.Mesh(geometry, material);
            rtScene.add(cube);
        }

        console.log(renderTarget.texture);
        let RenderTargetMaterial = new THREE.MeshBasicMaterial({
            envMap: GL.camera.renderTarget
        });
        // const TexturePath = "models/Textures/";
        // let urls = ['right', 'left', 'top', 'bottom', 'front', 'back'];
        // let bg = textureLoader.load(TexturePath + 'bg.jpg');
        let textureLoader = new THREE.TextureLoader();
        let backgroundTexture = textureLoader.load('textures/bg.png');
        GL.scene.background = backgroundTexture;
        // let hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
        // hemiLight.position.set( 0, 20, 0 );
        // GL.scene.add( hemiLight );

        let light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(-2, 7, 5);
        light.castShadow = true;
        GL.scene.add(light);

        GL.scene.add(new THREE.PointLightHelper(light));

        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 500;

        // let directionalLight = new THREE.DirectionalLight(0xffffff);
        // directionalLight.intensity = 0.1;
        // directionalLight.position.set(-2, 5, 10);
        // directionalLight.castShadow = true;
        // directionalLight.shadow.camera.near = 0.1;
        // directionalLight.shadow.camera.far = 500;
        // directionalLight.shadow.camera.right = 10;
        // directionalLight.shadow.camera.left = 10;
        // directionalLight.shadow.camera.top = 10;
        // directionalLight.shadow.camera.bottom = 10;
        // directionalLight.shadow.mapSize.width = 1024;
        // directionalLight.shadow.mapSize.height = 1024;

        // GL.scene.add(directionalLight);

        // adding plane
        let planeGeo = new THREE.PlaneBufferGeometry(60, 40, 32);
        let planeMat = new THREE.MeshStandardMaterial({
            // side: THREE.DoubleSide,
            // map: textureCol,
            // normalMap: textureNRM,
            // metalness: 0,
            // roughness: 0.7,
            // color: 0x00ff00,
            // depthWrite: false
        });


        let cubeGeom = new THREE.CubeGeometry(100, 100, 10, 1, 1, 1);
        mirrorCubeCamera = new THREE.CubeCamera(0.1, 5000, 512);
        GL.scene.add(mirrorCubeCamera);

        roulette = TextureToSpriteLoader.load('textures/test.png', new THREE.Vector3(7, 7, 1));
        GL.scene.add(roulette);
        let planeMesh = new THREE.Mesh(planeGeo, RenderTargetMaterial);
        planeMesh.position.y -= 5;
        planeMesh.position.z -= 2;
        planeMesh.rotation.x = -Math.PI / 2;
        planeMesh.receiveShadow = true;
        GL.scene.add(planeMesh);

        let torusKnotMaterial = new THREE.MeshStandardMaterial({
            roughness: 0,
            transparent: false,
            flatShading: true,
            // side: THREE.DoubleSide
        });

        console.log(GL);

        //lights

        // light helper
        // let lightHelper = new THREE.DirectionalLightHelper(directionalLight, 2);
        // GL.scene.add(lightHelper);


        // let ambient = new THREE.AmbientLight(0x404040);
        // GL.scene.add(ambient);

        // end ligths
        let RouletteModel = ModelLoader.load('models/', 'Idle.fbx', torusKnotMaterial, new THREE.Vector3(0.03, 0.03, 0.03));
        RouletteModel.then((mesh) => {
            GL.initializeAnimation(mesh);
            mesh.position.x -= 7.5;
            mesh.position.y -= 5;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            // mesh.position.z += 5;
            mesh.rotation.y += Math.PI / 4;
            GL.scene.add(mesh);
        }, (error) => {
            console.log(error);
        });

        GL.scene.add(TextureToSpriteLoader.load('textures/5.png', new THREE.Vector3(4, 4, 1)));
        GL.scene.add(TextureToSpriteLoader.load('textures/1.png', new THREE.Vector3(10.5, 10.5, 1)));
        GL.scene.add(TextureToSpriteLoader.load('textures/2.png', new THREE.Vector3(9.5, 9.5, 1)));


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
    GL.animateCallback = () => {
        roulette.material.rotation -= Math.PI / 256;

        GL.renderer.setRenderTarget(renderTarget);
        GL.renderer.render(rtScene, rtCamera);
        // mirrorCubeCamera.updateCubeMap( GL.renderer, GL.scene );
        // console.log(renderTarget);
    }
    GL.init();
    GL.animate();
}

window.onload = OnDocumentLoad;