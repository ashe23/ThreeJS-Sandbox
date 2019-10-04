export class TextureAnimator
{
    constructor(texture, rows, columns, tileDispDuration)
    {
        this.texture = texture;
        this.rows = rows;
        this.columns = columns;
        this.numTiles = this.rows * this.columns;
        this.tileDispDuration = tileDispDuration;
    }

    init()
    {
        this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
        this.texture.repeat.set(1 / this.columns, 1 / this.rows);
    }

    test(frame)
    {
        let offsetY = 1 / this.rows;
        let offsetX = 1 / this.columns;

        let FrameCoordX = frame % this.columns;
        let FrameCoordY = this.rows - 1 -  (frame % this.rows);

        console.log(frame, FrameCoordX, FrameCoordY);

        let currentColumn = FrameCoordX * offsetX;
        let currentRow = offsetY * (this.rows - FrameCoordY);

        
        this.texture.offset.x = currentColumn;
        this.texture.offset.y = currentRow;
    } 

    loop(milis)
    {
        let frame = Math.floor(milis % this.numTiles);   
        
        let offsetY = 1 / this.rows;
        let offsetX = 1 / this.columns;

        let FrameCoordX = frame % this.columns;
        let FrameCoordY = frame % this.rows;

        console.log(frame, FrameCoordX, FrameCoordY);

        let currentColumn = FrameCoordX * offsetX;
        let currentRow = offsetY * (this.rows - 1 - FrameCoordY);

        this.texture.offset.x = currentColumn;
        this.texture.offset.y = currentRow;       
    }
}