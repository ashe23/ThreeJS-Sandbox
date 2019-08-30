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
}