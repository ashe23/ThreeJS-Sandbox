import { GameConfigs } from './GameConfig.js';


export class GameLoop {
    constructor() {
        this.scene = {};
        this.camera = {};
        this.renderer = {};
        this.controls = {};
        this.clock = {};
        this.initCallback = () => {};
    }

    init() {
        // initializing Core components
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(GameConfigs.CameraSettings.fov, GameConfigs.CameraSettings.aspectRatio, GameConfigs.CameraSettings.far, GameConfigs.CameraSettings.near);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.controls = new THREE.TrackballControls(this.camera);
        this.clock = new THREE.Clock();
        this.renderer.setSize(GameConfigs.RendererSettings.windowWidth, GameConfigs.RendererSettings.windowHeight);
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.gammaOutput = true;


        // scene background setup
        this.scene.background = new THREE.Color(GameConfigs.RendererSettings.sceneColor);
        this.camera.position.z = 120;
        this.camera.position.y = 20;
        document.body.appendChild(this.renderer.domElement);

        this.initCallback();

        if (GameConfigs.RendererSettings.drawGridLines) {
            let grid = new THREE.GridHelper(100, 20, 0x444444, 0xff0000);
            grid.material.opacity = 0.2;
            grid.material.transparent = true;
            this.scene.add(grid);
        }

        window.addEventListener('resize', () => this.OnWindowResize(), false);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    OnWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}