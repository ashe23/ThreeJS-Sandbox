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
    constructor(wrapper)
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

        this.particles = {
            count: 10000,
            destPositions: [],
            originPositions: [],
            colors: [],
            geo: {},
            play: {},
            uniforms: {
                time: { value: 1 },
                uAnimation: { value: 1 },
                pointTexture: { value: new THREE.TextureLoader().load(sprites.point.path) },
            },
            material: {},
            system: {}
        }

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
        this.canvasText = {
            material: {},
            play: {},
            reverse: {},
            mesh: {},
            geometry: {},
            str: '00:04',
            fontSize: 90,
            font: "Roboto",
            lineHeight: 1.1,
            baseLine: 0.9,
        };
    }

    LoadRouletteSprites()
    {
        // let roulete_anim = new THREE.TextureLoader().load(sprites.roulette_anim.path);
        // this.TextureAnimator = new TextureAnimator(roulete_anim, 4, 3, 12, 0.01);
        // this.TextureAnimator.init();

        // var explosionMaterial = new THREE.MeshBasicMaterial( { map: this.TextureAnimator.texture } );
        // var cubeGeometry = new THREE.CubeGeometry( 500, 500, 500 );
        // let cube = new THREE.Mesh( cubeGeometry, explosionMaterial );
        // cube.position.set(-1,-2,0);
        // this.wrapper.sceneOrtho.add(cube);

        this.sprites.bg = SpriteLoader.load(sprites.bg.path, sprites.bg.scale);
        this.wrapper.scene.add(this.sprites.bg);

        this.wrapper.sceneOrtho.add(SpriteLoader.load(sprites.roulette1.path, sprites.roulette1.scale));
        this.wrapper.sceneOrtho.add(SpriteLoader.load(sprites.roulette3.path, sprites.roulette3.scale));

        this.sprites.roulette_lights = SpriteLoader.load(sprites.roulette2.path, sprites.roulette2.scale);
        this.wrapper.sceneOrtho.add(this.sprites.roulette_lights);

        this.sprites.number_pad = SpriteLoader.load(sprites.number_pad.path, sprites.number_pad.scale);
        this.wrapper.sceneOrtho.add(this.sprites.number_pad);


        // adding dissolve effect for sandtime
        // let spriteMap = new THREE.TextureLoader().load(sprites.sand_time.path);
        // let dissolveGeo = new THREE.PlaneGeometry(20, 20, 32);
        // let dissolveMaterial = new THREE.ShaderMaterial({
        //     uniforms: {
        //         uThreshold: {
        //             value: 0.5
        //         },
        //         uEdgeWidth: {
        //             value: 0.04
        //         },
        //         uEdgeColor: {
        //             value: [0, 229, 255]
        //         },
        //         uColor: {
        //             value: [20, 20, 20]
        //         },
        //         uFrequency: {
        //             value: 0.03
        //         },
        //         sandTimeTexture: {
        //             value: spriteMap
        //         }
        //     },
        //     vertexShader: dissolveVertShaderCode,
        //     fragmentShader: dissolveFragShaderCode,
        //     transparent: true,
        //     vertexColors: true
        // });
        // let plane = new THREE.Mesh(dissolveGeo, dissolveMaterial);
        // plane.position.set(-400, -300, 0);
        // plane.scale.set(10, 10, 10);
        // this.wrapper.sceneOrtho.add(plane);

        // TweenMax.fromTo(plane.material.uniforms.uThreshold, 2, { value: 0 }, { value: 1 });
        // setTimeout(() => { TweenMax.fromTo(plane.material.uniforms.uThreshold, 2, { value: 1 }, { value: 0 }); }, 3000);

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


        this.particles.uniforms.time.value = this.wrapper.clock.getElapsedTime();
        this.canvasText.material.uniforms.uTime.value = this.wrapper.clock.getElapsedTime();
        this.canvasText.material.uniforms.uOffset.value.set(-this.wrapper.width / 2, -this.wrapper.height / 2);

        this.canvasText.mesh.translateZ(-1 / 2 * Math.tan(this.wrapper.camera.fov / 360 * Math.PI) / this.wrapper.height);
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
        // this.wrapper.sceneOrtho.add(TimerSprite);

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
        let seconds = THREE.Math.randInt(5, 10);

        this.DesiredNumber = this.RouletteNumbers[THREE.Math.randInt(0, this.RouletteNumbers.length - 1)];
        // this.DesiredNumber = 0;
        console.log("DesiredNumber: " + this.DesiredNumber);
        this.Timer.value = (minutes * 60 + seconds) * 1000;

        TweenMax.fromTo(this.Timer.material, 2, { opacity: 0 }, { opacity: 1 });
        TweenMax.fromTo(this.particles.uniforms.uAnimation, this.Timer.value / 1000, { value: 0 }, { value: 1 });
        TweenMax.fromTo(this.particles.system, this.Timer.value / 1000, { opacity: 0 }, { opacity: 1 });

        this.UpdateCanvasText();
        this.canvasText.play();

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

            TweenMax.fromTo(this.Timer.material, 2, { opacity: 1 }, { opacity: 0 });
            this.canvasText.reverse();

            return;
        }

        this.Timer.value -= 1000;
        this.canvasText.str = GameHelper.MllisToMinutesAndSeconds(this.Timer.value);
        this.Timer.texture.text = GameHelper.MllisToMinutesAndSeconds(this.Timer.value);
        this.UpdateCanvasText();
        this.canvasText.material.uniforms.uAnimation.value = 1;
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
        // TweenMax.fromTo(this.sprites.arrow.material, this.arrow.frequency, { rotation: 0 }, { rotation: Math.PI / 4 });
        // setTimeout(this.StartArrowSpin.bind(this), (this.arrow.frequency + 0.01) * 1000);

        // todo
        // this.arrow.frequency = GameHelper.lerp(0.01, 1.5, GameHelper.easeOutQuart(this.time / (this.SpinDuration * this.SpinCount)));
        // console.log(this.arrow.frequency);

        // this.arrow.frequency = THREE.Math.mapLinear(this.sprites.number_pad.speed, 0 , 11, 1 , 0);
        // console.log(this.sprites.number_pad.speed, this.arrow.frequency);

        if (this.time + 2.1 > this.SpinDuration)
        {
            TweenMax.killTweensOf(this.arrow.animation);
            TweenMax.fromTo(this.sprites.arrow.material, 0.1, { rotation: this.sprites.arrow.material.rotation }, { rotation: 0 });
            return;
        }

        if (this.CurrentGameState === GameState.spinning)
        {
            this.arrow.animation = TweenMax.fromTo(this.sprites.arrow.material, this.arrow.frequency, { rotation: 0 }, { rotation: Math.PI / 4 });
            // this.arrow.frequency = THREE.Math.mapLinear(this.time, 0, this.SpinDuration - 3, 0.02, 1.4);
            setTimeout(this.StartArrowSpin.bind(this), (this.arrow.frequency + 0.01) * 1000);
            return;
        }
        else
        {
            console.log('Start Arrow Spin stopped!!!');
            TweenMax.killTweensOf(this.arrow.animation);
            // this.sprites.arrow.material.rotation = 0;
            TweenMax.fromTo(this.sprites.arrow.material, 0.1, { rotation: this.sprites.arrow.material.rotation }, { rotation: 0 });
        }
    }

    StopSpin()
    {
        this.time = 0;
        this.CurrentGameState = GameState.idle;
        this.offset = this.sprites.number_pad.material.rotation / (Math.PI * 2);
        this.arrow.frequency = 0;
        // TweenMax.killTweensOf(this.arrow.animation);
        // TweenMax.fromTo(this.sprites.arrow.material, 0.1, { rotation: this.sprites.arrow.material.rotation }, { rotation: 0 });
        console.log('Start Arrow Spin stopped!!!');
        // reseting game
        TweenMax.fromTo(this.particles.uniforms.uAnimation, 5, { value: 1 }, { value: 0 });
        setTimeout(this.StartCountDown.bind(this), 5000);
    };

    SpawnParticles() 
    {
        let color = new THREE.Color();
        for (let i = 0; i < this.particles.count; ++i)
        {
            let x = THREE.Math.randFloat(-this.wrapper.width, this.wrapper.width);
            let y = THREE.Math.randFloat(-this.wrapper.height, this.wrapper.height);
            let z = 0;

            this.particles.originPositions.push(x);
            this.particles.originPositions.push(y);
            this.particles.originPositions.push(z);

            this.particles.destPositions.push(-this.wrapper.width + 200);
            this.particles.destPositions.push(0);
            this.particles.destPositions.push(0);

            this.particles.colors.push(color.setHSL(1, 1, 0.6));
        }

        this.particles.geo = new THREE.BufferGeometry();
        this.particles.geo.addAttribute('position', new THREE.Float32BufferAttribute(this.particles.originPositions, 3));
        this.particles.geo.addAttribute('dest_position', new THREE.Float32BufferAttribute(this.particles.destPositions, 3));
        this.particles.geo.addAttribute('color', new THREE.Float32BufferAttribute(this.particles.colors, 3));

        this.particles.material = new THREE.ShaderMaterial({
            uniforms: this.particles.uniforms,
            vertexShader: vertexshaderCode,
            fragmentShader: fragmentShaderCode,
            blending: THREE.AdditiveBlending,
            transparent: true,
            vertexColors: true
        });


        this.particles.system = new THREE.Points(this.particles.geo, this.particles.material);
        this.wrapper.scene.add(this.particles.system);
    }

    GetNumberBasedOnRotation()
    {
        let index = Math.abs(Math.ceil(this.sprites.number_pad.material.rotation % (Math.PI * 2) / this.SingleNumberAngle - 0.01));
        if (index === 0)
        {
            return this.RouletteNumbers[0].toString();
        }

        return this.RouletteNumbers[this.RouletteNumbers.length - index].toString();
    }

    InitCanvasText()
    {
        this.canvasText.canvas = document.createElement('canvas');
        this.canvasText.ctx = this.canvasText.canvas.getContext('2d');

        this.canvasText.geometry = new THREE.BufferGeometry();
        this.canvasText.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(this.particles.count * 3), 3));
        this.canvasText.geometry.addAttribute('extras', new THREE.BufferAttribute(new Float32Array(this.particles.count * 2), 2));

        this.canvasText.material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { type: 'f', value: 0 },
                uAnimation: { type: 'f', value: 0 },
                uOffset: { type: 'v2', value: new THREE.Vector2() }
            },
            vertexShader: numbersVertShaderCode,
            fragmentShader: numbersFragShaderCode,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: true,
            depthTest: false
        });

        this.canvasText.play = () =>
        {
            TweenMax.fromTo(this.canvasText.material.uniforms.uAnimation, 1, { value: 0 }, { value: 1 });
        };

        this.canvasText.reverse = () =>
        {
            TweenMax.fromTo(this.canvasText.material.uniforms.uAnimation, 2, { value: 1 }, { value: 0 });
        };

        this.canvasText.mesh = new THREE.Points(this.canvasText.geometry, this.canvasText.material);
        this.canvasText.mesh.scale.set(0.4, 0.4, 0.4);

        this.wrapper.sceneOrtho.add(this.canvasText.mesh);

        this.UpdateCanvasText();
    }

    UpdateCanvasText()
    {

        this.canvasText.ctx.font = this.canvasText.fontSize + 'px ' + this.canvasText.font;
        let metrics = this.canvasText.ctx.measureText(this.canvasText.str);
        let width = this.canvasText.canvas.width = Math.ceil(metrics.width) || 1;
        let height = this.canvasText.canvas.height = Math.ceil(this.canvasText.lineHeight * this.canvasText.fontSize * this.canvasText.baseLine);

        // clearing old data
        this.canvasText.ctx.clearRect(0, 0, this.canvasText.canvas.width, this.canvasText.canvas.height);
        for (let i = 0; i < this.canvasText.geometry.attributes.position.array.length; ++i)
        {
            this.canvasText.geometry.attributes.position.array[i] = 0;
        }
        for (let i = 0; i < this.canvasText.geometry.attributes.extras.array.length; ++i)
        {
            this.canvasText.geometry.attributes.extras.array[i] = 0;
        }

        // redrawing new one
        this.canvasText.ctx.font = this.canvasText.fontSize + 'px ' + this.canvasText.font;
        this.canvasText.ctx.fillStyle = '#000';
        this.canvasText.ctx.fillText(this.canvasText.str, 0, this.canvasText.fontSize * this.canvasText.lineHeight * this.canvasText.baseLine + 1);


        let vertices = this.canvasText.geometry.attributes.position.array;
        let extras = this.canvasText.geometry.attributes.extras.array;
        let index;
        let data = this.canvasText.ctx.getImageData(0, 0, width, height).data;
        let count = 0;

        for (let i = 0, len = data.length; i < len; i += 4)
        {
            if (data[i + 3] > 0)
            {
                index = i / 4;
                vertices[count * 3] = index % width;
                vertices[count * 3 + 1] = index / width | 0;
                extras[count * 2] = data[i + 3] / 255;
                extras[count * 2 + 1] = Math.random();
                count++;
            }
        }

        this.canvasText.mesh.position.set(-this.canvasText.canvas.width - 375, -this.canvasText.canvas.height - 200, 0);
        this.canvasText.geometry.attributes.position.needsUpdate = true;
        this.canvasText.geometry.attributes.extras.needsUpdate = true;

    }
}