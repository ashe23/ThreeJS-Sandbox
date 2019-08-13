export class TextureToSpriteLoader {

    static load(TexturePath, scale, position) {
        if (!scale) scale = new THREE.Vector3(1, 1, 1);
        if (!position) position = new THREE.Vector3(1, 1, 1);

        let spriteMap = new THREE.TextureLoader().load(TexturePath);
        let spriteMaterial = new THREE.SpriteMaterial({
            map: spriteMap,
            color: 0xffffff,
        });
        let sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(scale.x, scale.y, scale.z);
        // sprite.position.set(position.x, position.y, position.z);
        return sprite;
    }
}