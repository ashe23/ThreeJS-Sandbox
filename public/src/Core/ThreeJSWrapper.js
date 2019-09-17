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
        this.camera.position.z = 200;

        this.cameraOrtho = new THREE.OrthographicCamera(-this.width / 2, this.width / 2, this.height / 2, -this.height / 2, 1, 10);
        this.cameraOrtho.position.z = 1;

        this.bgScene = new THREE.Scene();
        this.particlesScene = new THREE.Scene();
        this.spritesScene = new THREE.Scene();
        this.textScene = new THREE.Scene();

        this.scene = new THREE.Scene();
        this.sceneOrtho = new THREE.Scene();
        this.scene2 = new THREE.Scene();

        this.rtTexture = new THREE.WebGLRenderTarget(this.width, this.height, {
            format: THREE.RGBAFormat,
            type: THREE.UnsignedByteType
        });
        this.rtBuffer = new Uint8Array(this.width * this.height * 4);

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

        this.renderer.render(this.bgScene, this.cameraOrtho);
        this.renderer.render(this.particlesScene, this.camera);
        this.renderer.render(this.spritesScene, this.cameraOrtho);
        this.renderer.render(this.textScene, this.cameraOrtho);

        // this.renderer.render(this.scene, this.camera);
        this.renderer.clearDepth();
        // this.renderer.render(this.sceneOrtho, this.cameraOrtho);
        // this.renderer.render(this.scene2, this.camera);


        // this.renderer.render(this.scene, this.camera);
        // this.renderer.clearDepth();
        // this.renderer.render(this.sceneOrtho, this.cameraOrtho);
        // this.renderer.render(this.scene2, this.cameraOrtho);


        this.stats.end();

        requestAnimationFrame(this.animate.bind(this));
    }

    ReadBuffer()
    {
        this.renderer.readRenderTargetPixels(this.rtTexture, 0, 0, this.width, this.height, this.rtBuffer);
        console.log(this.rtBuffer);
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