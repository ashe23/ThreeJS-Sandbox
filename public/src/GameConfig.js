let GameConfigs = {
    CameraSettings: {
        fov: 50,
        aspectRation: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 10000
    },
    RendererSettings: {
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        sceneColor: 0x000000,
        drawGridLines: false
    }
};
export { GameConfigs };