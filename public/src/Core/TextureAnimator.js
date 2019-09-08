export class TextureAnimator
{
    constructor(texture, tileH, tileV, numTiles, tileDispDuration)
    {
        this.texture = texture;
        this.tileH = tileH;
        this.tileV = tileV;
        this.numTiles = numTiles;
        this.tileDispDuration = tileDispDuration;
        this.currentDispTime = 0;
        this.currentTile = 0;
    }

    init()
    {
        this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
        this.texture.repeat.set(1 / this.tileH, 1 / this.tileV);
    }

    update(milis)
    {
        this.currentDispTime += milis;
        while (this.currentDispTime > this.tileDispDuration)
        {
            this.currentDispTime -= this.tileDispDuration;
            this.currentTile++;
            if (this.currentTile == this.numTiles)
                this.currentTile = 0;
            var currentColumn = this.currentTile % this.tileH;
            this.texture.offset.x = currentColumn / this.tileH;
            var currentRow = Math.floor(this.currentTile / this.tileH);
            this.texture.offset.y = currentRow / this.tileV;
        }
    }
}