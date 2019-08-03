export class CubeMapLoader {
    static draw(path, urls, format) {
        let cubeMapTextureUrls = [];
        for (let i = 0; i < urls.length; ++i) {
            cubeMapTextureUrls.push(path + urls[i] + format);
        }
        var reflectionCube = new THREE.CubeTextureLoader().load(cubeMapTextureUrls);
        reflectionCube.format = THREE.RGBFormat;

        return reflectionCube;
    }
}