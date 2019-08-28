import { SpriteLoader } from './SpriteLoader.js';
import { GameHelper } from './GameHelper.js';

export let sprites = {
    bg: {
        path: 'textures/Roulette/T_BG.png',
        scale: new THREE.Vector3(4000, 2000, 1)
    },
    number_pad:
    {
        path: 'textures/Roulette/numberpad.png',
        scale: new THREE.Vector3(400, 400, 1),
    },
    arrow:
    {
        path: 'textures/Roulette/T_Arrow.png',
        scale: new THREE.Vector3(40, 60, 1),
    },
    point:
    {
        path: 'textures/Roulette/T_Point.png',
        scale: new THREE.Vector3(1, 1, 1),

    },
    sand_time:
    {
        path: 'textures/Roulette/T_SandTime.png',
        scale: new THREE.Vector3(70, 100, 1),
    },
    roulette1:
    {
        path: 'textures/Roulette/roulette_1.png',
        scale: new THREE.Vector3(500, 500, 1),
    },
    roulette2:
    {
        path: 'textures/Roulette/roulette_2.png',
        scale: new THREE.Vector3(500, 500, 1),
    },
    roulette3:
    {
        path: 'textures/Roulette/roulette_3.png',
        scale: new THREE.Vector3(200, 200, 1),
    },
    dissolve:
    {
        path: 'textures/Roulette/Dissolve.png',
        scale: new THREE.Vector3(1, 1, 1)
    }
};

export let GameState = {
    idle: 1,
    spinning: 2,
}

export class RouletteGame
{
    constructor(wrapper)
    {
        this.CurrentGameState = GameState.idle;
        this.RouletteNumbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 21, 13, 36, 11, 30, 8, 23, 5, 24, 18, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
        this.FPS = 60;
        this.step = 1 / this.FPS;
        this.SingleNumberAngle = -0.1745329251994; // radian
        this.SpinCount = 5;
        this.SpintDuration = 10; // sec
        this.wrapper = wrapper;
        this.number_pad = {};
        this.DesiredNumber = 0;

        this.Timer = {
            texture: {},
            material: {},
            value: 0,
            handler: {},
        };

        this.WinNumber = {
            texture: {},
            material: {},
            value: 0,
            handler: {}
        }
    }

    LoadRouletteSprites()
    {
        this.wrapper.sceneOrtho.add(SpriteLoader.load(sprites.bg.path, sprites.bg.scale));
        this.wrapper.sceneOrtho.add(SpriteLoader.load(sprites.roulette1.path, sprites.roulette1.scale));
        this.wrapper.sceneOrtho.add(SpriteLoader.load(sprites.roulette2.path, sprites.roulette2.scale));
        this.wrapper.sceneOrtho.add(SpriteLoader.load(sprites.roulette3.path, sprites.roulette3.scale));
        this.number_pad = SpriteLoader.load(sprites.number_pad.path, sprites.number_pad.scale);
        this.wrapper.sceneOrtho.add(this.number_pad);

        let sand_time = SpriteLoader.load(sprites.sand_time.path, sprites.sand_time.scale);
        this.wrapper.sceneOrtho.add(sand_time);
        sand_time.center.set(8.5, 4.5);

        let arrow = SpriteLoader.load(sprites.arrow.path, sprites.arrow.scale);
        this.wrapper.sceneOrtho.add(arrow);
        arrow.position.set(0, 250, 0);

    }

    LoadTextSprites()
    {
        // Timer Text
        this.Timer.texture = new THREE.TextTexture({
            fontFamily: '"Roboto"',
            fontSize: 30,
            text: '00:00',
        });
        this.Timer.material = new THREE.SpriteMaterial({
            color: 0xffffbb,
            map: this.Timer.texture
        });

        let TimerSprite = new THREE.Sprite(this.Timer.material);
        TimerSprite.scale.setX(this.Timer.texture.image.width / this.Timer.texture.image.height).multiplyScalar(40);
        TimerSprite.center.set(7.48, 8.5);
        this.wrapper.sceneOrtho.add(TimerSprite);

        // Win Number Text
        let WinNumberTexture = new THREE.TextTexture({
            fontFamily: '"Roboto"',
            fontSize: 256,
            text: '0',
        });
        let WinNumberMaterial = new THREE.SpriteMaterial({
            color: 0xffffbb,
            map: WinNumberTexture,
        });

        let WinNumberSprite = new THREE.Sprite(WinNumberMaterial);
        WinNumberSprite.scale.setX(1.3).multiplyScalar(100);
        WinNumberSprite.position.set(4, -5, 0);
        this.wrapper.sceneOrtho.add(WinNumberSprite);
    }

    StartCountDown()
    {
        let minutes = THREE.Math.randInt(0, 0);
        let seconds = THREE.Math.randInt(0, 3);

        this.DesiredNumber = this.RouletteNumbers[THREE.Math.randInt(0, this.RouletteNumbers.length - 1)];
        this.Timer.value = (minutes * 60 + seconds) * 1000;

        TweenMax.fromTo(this.Timer.material, 2, { opacity: 0 }, { opacity: 1 });
        // setTimeout(StartGame, countdownValue);
        this.Timer.handler = setInterval(this.CountDownTextUpdate.bind(this), 1000);
    }
    CountDownTextUpdate()
    {
        if (this.Timer.value === 0)
        {
            clearInterval(this.Timer.handler);
            console.log('Timer stopped');

            TweenMax.fromTo(this.Timer.material, 2, { opacity: 1 }, { opacity: 0 });
            return;
        }
        this.Timer.value -= 1000;
        this.Timer.texture.text = GameHelper.MllisToMinutesAndSeconds(this.Timer.value);
    }
    Spin() { };
    StopSpin() { };
}