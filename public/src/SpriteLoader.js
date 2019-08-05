export class TextureToSpriteLoader {

    static load(TexturePath, scale)
    {
        let spriteMap = new THREE.TextureLoader().load(TexturePath);
        let spriteMaterial = new THREE.SpriteMaterial({
            map: spriteMap,
            color: 0xffffff,
        });
        let sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(scale.x,scale.y,scale.z);
        return sprite;
    }
}