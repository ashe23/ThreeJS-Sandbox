export class SpriteLoader
{
    static load(path, scale, opacity)
    {
        if (!scale) scale = new THREE.Vector3(1, 1, 1);
        let op = opacity ? opacity : 1;

        let spriteMap = new THREE.TextureLoader().load(path);
        let spriteMaterial = new THREE.SpriteMaterial({
            map: spriteMap,
            blending: THREE.CustomBlending,
            depthTest: false,
            opacity: op
        });
        let sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(scale.x, scale.y, scale.z);

        return sprite;
    }
}