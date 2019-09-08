export class GameHelper
{
    static MllisToMinutesAndSeconds(millis)
    {
        let minutes = Math.floor(millis / 60000);
        let seconds = ((millis % 60000) / 1000).toFixed(0);
        return (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    static lerp(a, b, t)
    {
        return (1 - t) * a + t * b;
    }

    static easeOutQuart(t)
    {
        return 1 - Math.pow(1 - t, 4);
    }

    static easeInOutQuint(t)
    {
        return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
    }

    static inverseEaseInOutQuart(t)
    {
        return (1 - t) ^ (1 / 4);
    }

    // Reads color buffer from texture to Uint8Array
    static readColorBufferFromTexture(path)
    {
        return new Promise((resolve, reject) =>
        {
            const loader = new THREE.TextureLoader();
            let originalColors;
            loader.load(path, (texture) =>
            {
                texture.format = THREE.RGBAFormat;

                const img = texture.image;
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.scale(1, -1);
                ctx.drawImage(img, 0, 0, img.width, img.height * -1);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                originalColors = Uint8Array.from(imageData.data);

                resolve(originalColors);
            });
        })
    }
}