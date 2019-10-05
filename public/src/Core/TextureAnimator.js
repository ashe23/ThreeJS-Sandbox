export class TextureAnimator
{
    constructor(texture, rows, columns, tileDispDuration)
    {
        this.texture = texture;
        this.rows = rows;
        this.columns = columns;
        this.numTiles = this.rows * this.columns;
        this.tileDispDuration = tileDispDuration;
        this.time = 0;
        this.frame = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.frameCount = 0;
    }

    init()
    {
        this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
        this.texture.repeat.set(1 / this.columns, 1 / this.rows);

        this.offsetX = 1 / this.columns;
        this.offsetY = 1 / this.rows;
    }

    test(frame)
    {
        this.frame = frame;
        this.calculateOffsets();
        // let FrameCoordX = frame % this.columns;
        // let FrameCoordY = this.rows - 1 - (frame % this.rows);

        // let currentColumn = FrameCoordX * this.offsetX;
        // let currentRow = this.offsetY * (this.rows - FrameCoordY);

        // this.texture.offset.x = currentColumn;
        // this.texture.offset.y = currentRow;
    }

    calculateOffsets()
    {
        let FrameCoordX = this.frame % this.columns;
        let FrameCoordY = this.frame % this.rows;

        let currentColumn = FrameCoordX * this.offsetX;
        let currentRow = this.offsetY * (this.rows - 1 - FrameCoordY);

        this.texture.offset.x = currentColumn;
        this.texture.offset.y = currentRow;
    }

    loop(milis)
    {
        // this.frameCount++;
        // if (this.frameCount > 6)
        // {
        //     this.frameCount = 0;
        //     this.frame++;
        // }
        this.frame = Math.floor(milis % this.numTiles);
        console.log(this.frame);
        this.calculateOffsets();
        // console.log(milis, this.frame);

    }
}