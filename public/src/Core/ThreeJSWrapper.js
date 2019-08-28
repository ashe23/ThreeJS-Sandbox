'use strict';

export class ThreeJSWrapper
{
    constructor()
    {
        this.init_callback = () => { };
        this.animate_callback = () => { };
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 1, 2100);
        this.camera.position.z = 1500;

        this.cameraOrtho = new THREE.OrthographicCamera(-this.width / 2, this.width / 2, this.height / 2, -this.height / 2, 1, 10);
        this.cameraOrtho.position.z = 1;

        this.scene = new THREE.Scene();
        this.sceneOrtho = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.autoClear = false;
        document.body.appendChild(this.renderer.domElement);

        this.clock = new THREE.Clock();
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);
      

        this.OnWindowResize();
        window.addEventListener('resize', this.OnWindowResize.bind(this), false);
    }
    init()
    {
        this.init_callback();
    }
    animate()
    {
        this.stats.begin();

        this.animate_callback();

        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
        this.renderer.clearDepth();
        this.renderer.render(this.sceneOrtho, this.cameraOrtho);

        this.stats.end();

        requestAnimationFrame(this.animate.bind(this));
    }

    OnWindowResize()
    {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        let aspect_ratio = this.width / this.height;

        this.camera.aspect = aspect_ratio;
        this.camera.updateProjectionMatrix();

        this.cameraOrtho.left = -this.width / 2;
        this.cameraOrtho.right = this.width / 2;
        this.cameraOrtho.top = this.height / 2;
        this.cameraOrtho.bottom = -this.height / 2;
        this.cameraOrtho.updateProjectionMatrix();

        this.renderer.setSize(this.width, this.height);
    }
}