import { SpriteLoader } from './SpriteLoader.js';
import { GameHelper } from './GameHelper.js';
import { DissolveSprite } from './DissolveSprite.js';
import { Sprites } from './RouletteSprites.js';


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
    },
    roulette_anim:
    {
        path: 'textures/Roulette/RouletteAnim.png',
        scale: new THREE.Vector2(1, 1, 1)
    }
};

export let GameState = {
    idle: 1,
    spinning: 2,
}

export class RouletteGame
{
    constructor(wrapper, TimerText, WinNumberText)
    {
        this.CurrentGameState = GameState.idle;
        this.lastTickRotation = 0;
        this.RouletteNumbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 21, 13, 36, 11, 30, 8, 23, 5, 24, 18, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
        this.FPS = 60;
        this.time = 0;
        this.step = 1 / this.FPS;
        this.SingleNumberAngle = -0.1745329251994; // radian
        this.SpinCount = 5;
        this.SpinDuration = 10; // sec
        this.wrapper = wrapper;
        this.DesiredNumber = 0;
        this.offset = 0;
        this.TimerText = TimerText;
        this.WinNumberText = WinNumberText;

        this.sprites = {
            number_pad: {},
            sand_time: {},
            arrow: {},
            lights: {},
        };

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

        this.arrow = {
            frequency: 0.1,
            animation: {},
        };

        this.TextureAnimator = {};
    }

    LoadRouletteSprites()
    {
        this.wrapper.bgScene.add(SpriteLoader.load(sprites.bg.path, sprites.bg.scale));

        this.sprites.roulette1 = new DissolveSprite(this.wrapper, Sprites.roulette1.path, Sprites.roulette1.scale);
        this.sprites.number_pad = new DissolveSprite(this.wrapper, Sprites.number_pad.path, Sprites.number_pad.scale);
        this.sprites.roulette3 = new DissolveSprite(this.wrapper, Sprites.roulette3.path, Sprites.roulette3.scale);
        this.sprites.lights = new DissolveSprite(this.wrapper, Sprites.roulette2.path, Sprites.roulette2.scale);
        this.sprites.arrow = new DissolveSprite(this.wrapper, Sprites.arrow.path, Sprites.arrow.scale, new THREE.Vector3(0, 250, 0));
        // this.sprites.sand_time = new DissolveSprite(this.wrapper, Sprites.sand_time.path, Sprites.sand_time.scale, new THREE.Vector3(-this.wrapper.width / 2 + 150, -this.wrapper.height / 2 + 80, 0));
    }

    SpinLoop()
    {
        if (this.CurrentGameState === GameState.spinning)
        {
            this.time += this.step;
            this.Spin();

            if (this.time + 1 > this.SpinDuration)
            {
                this.StopSpin();
            }
        }


        this.arrow.frequency = GameHelper.lerp(0.01, 1.0, GameHelper.easeOutQuart(this.time / (this.SpinDuration * this.SpinCount)));
    }

    LoadTextSprites()
    {
        // Win Number Text
        this.WinNumber.texture = new THREE.TextTexture({
            fontFamily: '"Roboto"',
            fontSize: 256,
            text: '0',
        });
        this.WinNumber.material = new THREE.SpriteMaterial({
            color: 0xffffbb,
            map: this.WinNumber.texture,
        });

        let WinNumberSprite = new THREE.Sprite(this.WinNumber.material);
        WinNumberSprite.scale.setX(1.3).multiplyScalar(100);
        WinNumberSprite.position.set(4, -5, 0);
        this.wrapper.sceneOrtho.add(WinNumberSprite);
    }

    StartCountDown()
    {
        let minutes = THREE.Math.randInt(0, 0);
        let seconds = THREE.Math.randInt(3, 5);

        this.DesiredNumber = this.RouletteNumbers[THREE.Math.randInt(0, this.RouletteNumbers.length - 1)];

        console.log("DesiredNumber: " + this.DesiredNumber);

        this.Timer.value = (minutes * 60 + seconds) * 1000;
        this.TimerText.play(2);

        this.sprites.lights.appear();
        this.sprites.number_pad.appear();
        this.sprites.roulette3.appear();
        this.sprites.roulette1.appear();
        this.sprites.arrow.appear();
        // this.sprites.sand_time.appear();

        TweenMax.fromTo(this.sprites.roulette3.mesh.scale, 2, { x: 8 }, { x: 5 });
        TweenMax.fromTo(this.sprites.roulette3.mesh.scale, 2, { y: 8 }, { y: 5 });
        TweenMax.fromTo(this.sprites.roulette3.mesh.scale, 2, { z: 8 }, { z: 5 });

        setTimeout(() =>
        {
            this.CurrentGameState = GameState.spinning;
            this.StartArrowSpin();
        }, this.Timer.value);
        this.Timer.handler = setInterval(this.CountDownTextUpdate.bind(this), 1000);
    }

    CountDownTextUpdate()
    {
        if (this.Timer.value === 0)
        {
            clearInterval(this.Timer.handler);
            console.log('Timer stopped');

            this.TimerText.reverse(3);
            return;
        }

        this.Timer.value -= 1000;
        this.TimerText.text = GameHelper.MllisToMinutesAndSeconds(this.Timer.value);
        this.TimerText.updateText();
    }

    Spin()
    {
        if (!this.sprites.number_pad) return;

        let DesiredRotation = Math.PI * 2 * this.SpinCount + this.RouletteNumbers.indexOf(this.DesiredNumber) * this.SingleNumberAngle;

        let rot = -GameHelper.lerp(this.offset, DesiredRotation, GameHelper.easeOutQuart(this.time / this.SpinDuration));
        this.sprites.number_pad.mesh.rotation.set(0, 0, rot);
        this.sprites.lights.mesh.rotation.set(0, 0, rot);

        this.WinNumberText.text = this.GetNumberBasedOnRotation();

        if (this.WinNumberText.text < 10)
        {
            this.WinNumberText.position = new THREE.Vector3(-25, 60, 0);
        }
        else
        {
            this.WinNumberText.position = new THREE.Vector3(-52, 60, 0);
        }

        this.WinNumberText.updateText();
    };

    StartArrowSpin()
    {
        if (this.time + 2.1 > this.SpinDuration)
        {
            TweenMax.killTweensOf(this.arrow.animation);
            TweenMax.fromTo(this.sprites.arrow.mesh.rotation, 0.1, { z: this.sprites.arrow.mesh.rotation.z }, { z: 0 });
            return;
        }

        if (this.CurrentGameState === GameState.spinning)
        {
            this.arrow.animation = TweenMax.fromTo(this.sprites.arrow.mesh.rotation, this.arrow.frequency, { z: 0 }, { z: Math.PI / 4 });
            setTimeout(this.StartArrowSpin.bind(this), (this.arrow.frequency + 0.01) * 1000);
            return;
        }
        else
        {
            console.log('Start Arrow Spin stopped!!!');
            // TweenMax.killTweensOf(this.arrow.animation);
            console.log(this.sprites.arrow);
            TweenMax.fromTo(this.sprites.arrow.mesh.rotation, 0.1, { z: this.sprites.arrow.mesh.rotation.z }, { z: 0 });
        }
    }

    StopSpin()
    {
        this.time = 0;
        this.CurrentGameState = GameState.idle;
        this.offset = this.sprites.number_pad.mesh.rotation.z / (Math.PI * 2);
        this.arrow.frequency = 0;
        console.log('Start Arrow Spin stopped!!!');

        this.sprites.lights.disappear();
        this.sprites.number_pad.disappear();
        // this.sprites.roulette3.disappear();
        TweenMax.fromTo(this.sprites.roulette3.mesh.scale, 2, { x: 5 }, { x: 8 });
        TweenMax.fromTo(this.sprites.roulette3.mesh.scale, 2, { y: 5 }, { y: 8 });
        TweenMax.fromTo(this.sprites.roulette3.mesh.scale, 2, { z: 5 }, { z: 8 });
        this.sprites.roulette1.disappear();
        this.sprites.arrow.disappear();
        // this.sprites.sand_time.disappear();

        // this.WinNumberText.playScaleAnim();
        // reseting game        
        setTimeout(this.StartCountDown.bind(this), 5000);
    };


    GetNumberBasedOnRotation()
    {
        let index = Math.abs(Math.ceil(this.sprites.number_pad.mesh.rotation.z % (Math.PI * 2) / this.SingleNumberAngle - 0.01));
        if (index === 0)
        {
            return this.RouletteNumbers[0].toString();
        }
        return this.RouletteNumbers[this.RouletteNumbers.length - index].toString();
    }
}