let GameConfigs = {
    CoreSettings: {
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
    },
    CameraSettings: {
        fov: 50,
        aspectRation: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 10000,
    },
    RendererSettings: {
        canvas: document.querySelector('#c'),
        antialias: true,
    },
    Helpers: {
        sceneColor: 0x000000,
        drawAxisHelper: false,
        drawGridLines: false,
        doubleCameraMode: false
    }
};
export { GameConfigs };