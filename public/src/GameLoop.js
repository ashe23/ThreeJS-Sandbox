import { GameConfigs } from './GameConfig.js';


export class GameLoop {
    constructor() {
        this.scene = {};
        this.camera = {};
        this.renderer = {};
        this.controls = {};
        this.clock = {};
        this.vnh = {};
        this.stats = {};
        this.initCallback = () => { };
    }

    init() {
        // initializing Core components
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(GameConfigs.CameraSettings.fov, GameConfigs.CameraSettings.aspectRatio, GameConfigs.CameraSettings.far, GameConfigs.CameraSettings.near);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(GameConfigs.RendererSettings.windowWidth, GameConfigs.RendererSettings.windowHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.gammaOutput = true;
        document.body.appendChild(this.renderer.domElement);
        this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
        this.controls.noZoom = false;
        this.controls.noPan = false;
        this.controls.addEventListener('change', () => this.render());
        // this.controls.staticMoving = true;
        this.clock = new THREE.Clock();

        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);


        // this.vnh = new THREE.VertexNormalsHelper( mesh, 10, 0x00ff00, 10 );


        // scene background setup
        this.scene.background = new THREE.Color(GameConfigs.RendererSettings.sceneColor);
        this.camera.position.z = 120;
        this.camera.position.y = 20;

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
        
        this.stats.begin();


        if(!(Object.keys(this.vnh).length === 0 && this.vnh.constructor === Object)) 
        {
            this.vnh.update();
        }
        
        this.controls.update();
        this.render();

        this.stats.end();

        requestAnimationFrame(() => this.animate());
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    OnWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}