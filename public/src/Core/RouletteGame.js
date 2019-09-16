import { SpriteLoader } from './SpriteLoader.js';
import { GameHelper } from './GameHelper.js';
import { TextureAnimator } from './TextureAnimator.js'
import vertexshaderCode from '../../shaders/main.vs'
import fragmentShaderCode from '../../shaders/main.fs'
import dissolveVertShaderCode from '../../shaders/dissolve.vs'
import dissolveFragShaderCode from '../../shaders/dissolve.fs'
import numbersVertShaderCode from '../../shaders/numbers.vs'
import numbersFragShaderCode from '../../shaders/numbers.fs'

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
            number_pad: {
                speed: 0
            },
            sand_time: {},
            arrow: {},
            roulette_lights: {},
            bg: {}
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
        this.sprites.bg = SpriteLoader.load(sprites.bg.path, sprites.bg.scale);
        this.wrapper.scene.add(this.sprites.bg);      

        this.wrapper.sceneOrtho.add(SpriteLoader.load(sprites.roulette1.path, sprites.roulette1.scale));
        this.wrapper.sceneOrtho.add(SpriteLoader.load(sprites.roulette3.path, sprites.roulette3.scale));

        this.sprites.roulette_lights = SpriteLoader.load(sprites.roulette2.path, sprites.roulette2.scale);
        this.wrapper.sceneOrtho.add(this.sprites.roulette_lights);

        this.sprites.number_pad = SpriteLoader.load(sprites.number_pad.path, sprites.number_pad.scale);
        this.wrapper.sceneOrtho.add(this.sprites.number_pad);

        this.sprites.sand_time = SpriteLoader.load(sprites.sand_time.path, sprites.sand_time.scale);
        this.wrapper.sceneOrtho.add(this.sprites.sand_time);
        this.sprites.sand_time.center.set(8.5, 4.5);

        this.sprites.arrow = SpriteLoader.load(sprites.arrow.path, sprites.arrow.scale);
        this.wrapper.sceneOrtho.add(this.sprites.arrow);
        this.sprites.arrow.position.set(0, 250, 0);
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
        // this.DesiredNumber = 0;
        console.log("DesiredNumber: " + this.DesiredNumber);
        this.Timer.value = (minutes * 60 + seconds) * 1000;
        this.TimerText.play(2);

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

        this.sprites.number_pad.material.rotation = -GameHelper.lerp(this.offset, DesiredRotation, GameHelper.easeOutQuart(this.time / this.SpinDuration));
        this.sprites.roulette_lights.material.rotation = -GameHelper.lerp(this.offset, DesiredRotation, GameHelper.easeOutQuart(this.time / this.SpinDuration));

        this.WinNumber.texture.text = this.GetNumberBasedOnRotation();
    };

    StartArrowSpin()
    {
        if (this.time + 2.1 > this.SpinDuration)
        {
            TweenMax.killTweensOf(this.arrow.animation);
            TweenMax.fromTo(this.sprites.arrow.material, 0.1, { rotation: this.sprites.arrow.material.rotation }, { rotation: 0 });
            return;
        }

        if (this.CurrentGameState === GameState.spinning)
        {
            this.arrow.animation = TweenMax.fromTo(this.sprites.arrow.material, this.arrow.frequency, { rotation: 0 }, { rotation: Math.PI / 4 });
            setTimeout(this.StartArrowSpin.bind(this), (this.arrow.frequency + 0.01) * 1000);
            return;
        }
        else
        {
            console.log('Start Arrow Spin stopped!!!');
            TweenMax.killTweensOf(this.arrow.animation);
            TweenMax.fromTo(this.sprites.arrow.material, 0.1, { rotation: this.sprites.arrow.material.rotation }, { rotation: 0 });
        }
    }

    StopSpin()
    {
        this.time = 0;
        this.CurrentGameState = GameState.idle;
        this.offset = this.sprites.number_pad.material.rotation / (Math.PI * 2);
        this.arrow.frequency = 0;
        console.log('Start Arrow Spin stopped!!!');

        // reseting game        
        setTimeout(this.StartCountDown.bind(this), 5000);
    };


    GetNumberBasedOnRotation()
    {
        let index = Math.abs(Math.ceil(this.sprites.number_pad.material.rotation % (Math.PI * 2) / this.SingleNumberAngle - 0.01));
        if (index === 0)
        {
            return this.RouletteNumbers[0].toString();
        }

        return this.RouletteNumbers[this.RouletteNumbers.length - index].toString();
    }
}