import { GameConfigs } from './GameConfig.js';

const size = 1;
const near = 5;
const far = 50;
const canvas = document.querySelector('#c');
const view1Elem = document.querySelector('#view1');
const view2Elem = document.querySelector('#view2');

export class GameLoop {
    constructor() {
        this.scene = {};
        this.camera = {};
        this.camera1 = {};
        this.camera2 = {};
        this.cameraHelper = {};
        this.renderer = {};
        this.controls = {};
        this.controls1 = {};
        this.controls2 = {};
        this.clock = {};
        this.vnh = {};
        this.stats = {};
        this.animationMixer = {};
        this.initCallback = () => { };
        this.animateCallback = () => { };
    }

    init() {
        // initializing Core components

        this.setupScene();
        this.setupRenderer();
        this.setupCamera();

        // this.setupCameraView1();
        // this.setupCameraView2();

        // this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        // this.controls.addEventListener('change', () => this.render());


        // clock
        this.clock = new THREE.Clock();

        // fps stats
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);

        // user defined logic that should be executed in init function
        this.initCallback();

        this.setupConfigs();

        // window.addEventListener('resize', () => this.OnWindowResize(), false);
        // this.OnWindowResize();
    }

    animate() {

        this.stats.begin();


        if (!(Object.keys(this.vnh).length === 0 && this.vnh.constructor === Object)) {
            this.vnh.update();
        }

        if (!(Object.keys(this.animationMixer).length === 0 && this.animationMixer.constructor === Object)) {
            this.animationMixer.update(this.clock.getDelta());
        }
        // this.camera.lookAt(this.scene.position);

        // user defined logic that should be executed in animate function
        this.animateCallback();


        // this.controls.update();
        this.render();

        this.stats.end();

        requestAnimationFrame(() => this.animate());
    }

    render() {
        this.resizeRendererToDisplaySize();

        if (GameConfigs.Helpers.doubleCameraMode) {
            this.DoubleCameraSetup();
        }
        else {
            this.SingleCameraSetup();
        }

        // requestAnimationFrame(this.render);
        // this.renderer.render(this.scene, this.camera);
    }

    DoubleCameraSetup() {
        this.renderer.setScissorTest(true);
        // render the original view
        {
            const aspect = this.setScissorForElement(view1Elem);
            // update the camera for this aspect
            this.camera1.left = -aspect;
            this.camera1.right = aspect;
            this.camera1.updateProjectionMatrix();
            this.cameraHelper.update();
            // don't draw the camera helper in the original view
            this.cameraHelper.visible = false;
            this.scene.background.set(0x808080);
            this.renderer.render(this.scene, this.camera1);
        }
        // render from the 2nd camera
        {
            const aspect = this.setScissorForElement(view2Elem);
            // update the camera for this aspect
            this.camera2.aspect = aspect;
            this.camera2.updateProjectionMatrix();
            // draw the camera helper in the 2nd view
            this.cameraHelper.visible = true;
            this.scene.background.set(0x888083);
            this.renderer.render(this.scene, this.camera2);
        }
    }

    SingleCameraSetup() {
        this.renderer.render(this.scene, this.camera);
    }

    OnWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    setupConfigs() {
        if (GameConfigs.Helpers.drawGridLines) {
            let grid = new THREE.GridHelper(100, 20, 0x444444, 0xff0000);
            grid.material.opacity = 0.2;
            grid.material.transparent = true;
            this.scene.add(grid);
        }

        if (GameConfigs.Helpers.drawAxisHelper) {
            // axis helper
            this.scene.add(new THREE.AxesHelper(20));
        }
    }
    setupCameraView1() {
        this.camera1 = new THREE.OrthographicCamera(-size, size, size, -size, near, far);
        this.camera1.zoom = 0.2;
        this.camera1.position.set(0, 10, 20);
        this.cameraHelper = new THREE.CameraHelper(this.camera1);
        this.scene.add(this.cameraHelper);

        this.controls1 = new THREE.OrbitControls(this.camera1, view1Elem);
        this.controls1.target.set(0, 5, 0);
        this.controls1.update();
    }

    setupCameraView2() {
        this.camera2 = new THREE.PerspectiveCamera(60, 2, 0.1, 500);
        this.camera2.position.set(16, 28, 40);
        this.camera2.lookAt(0, 5, 0);

        this.controls1 = new THREE.OrbitControls(this.camera2, view2Elem);
        this.controls1.target.set(0, 5, 0);
        this.controls1.update();
    }
    resizeRendererToDisplaySize() {
        const canvas = this.renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            this.renderer.setSize(width, height, false);
        }
        return needResize;
    }
    setScissorForElement(elem) {
        const canvasRect = canvas.getBoundingClientRect();
        const elemRect = elem.getBoundingClientRect();

        // compute a canvas relative rectangle
        const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
        const left = Math.max(0, elemRect.left - canvasRect.left);
        const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
        const top = Math.max(0, elemRect.top - canvasRect.top);

        const width = Math.min(canvasRect.width, right - left);
        const height = Math.min(canvasRect.height, bottom - top);

        // setup the scissor to only render to that part of the canvas
        const positiveYUpBottom = canvasRect.height - bottom;
        this.renderer.setScissor(left, positiveYUpBottom, width, height);
        this.renderer.setViewport(left, positiveYUpBottom, width, height);

        // return the aspect
        return width / height;
    }

    initializeAnimation(mesh) {
        this.animationMixer = new THREE.AnimationMixer(mesh.scene);
        // debugger;
        let clips = mesh.animations;

        let clip = THREE.AnimationClip.findByName(clips, 'Dance');
        let action = this.animationMixer.clipAction(clip);
        action.play();
    }

    setupScene() {
        this.scene = new THREE.Scene();
    }
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer(GameConfigs.RendererSettings);
        this.renderer.setPixelRatio(window.devicePixelRatio);
    }
    setupCamera() {
        if (GameConfigs.Helpers.doubleCameraMode) {
            this.setupCameraView1();
            this.setupCameraView2();
        }
        else {
            this.camera = new THREE.PerspectiveCamera(60, 2, 0.1, 500);
            this.camera.position.set(16, 28, 40);
            this.camera.lookAt(0, 5, 0);

            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            // this.controls.target.set(0, 5, 0);
            this.controls.update();
        }
    }
}