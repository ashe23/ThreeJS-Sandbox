import { SpriteLoader } from './SpriteLoader.js';
import { GameHelper } from './GameHelper.js';
import { TextureAnimator } from './TextureAnimator.js'


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
            uniforms: {
                time: { value: 1 },
                uAnimation: { value: 1 },
                pointTexture: { value: new THREE.TextureLoader().load(sprites.point.path) },
                // dissolveTexture: { value: new THREE.TextureLoader().load(sprites.dissolve) },
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
    }

    LoadRouletteSprites()
    {
        // let roulete_anim = new THREE.TextureLoader().load(sprites.roulette_anim.path);
        // this.TextureAnimator = new TextureAnimator(roulete_anim, 4, 3, 12, 0.01);
        // this.TextureAnimator.init();

        // var explosionMaterial = new THREE.MeshBasicMaterial( { map: this.TextureAnimator.texture } );
        // var cubeGeometry = new THREE.CubeGeometry( 500, 500, 500 );
        // let cube = new THREE.Mesh( cubeGeometry, explosionMaterial );
        // cube.position.set(0,26,0);
        // this.wrapper.scene.add(cube);

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
        let seconds = THREE.Math.randInt(0, 3);

        this.DesiredNumber = this.RouletteNumbers[THREE.Math.randInt(0, this.RouletteNumbers.length - 1)];
        // this.DesiredNumber = 0;
        console.log("DesiredNumber: " + this.DesiredNumber);
        this.Timer.value = (minutes * 60 + seconds) * 1000;

        TweenMax.fromTo(this.Timer.material, 2, { opacity: 0 }, { opacity: 1 });

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
            return;
        }

        this.Timer.value -= 1000;
        this.Timer.texture.text = GameHelper.MllisToMinutesAndSeconds(this.Timer.value);
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

            this.particles.destPositions.push(0);
            this.particles.destPositions.push(0);
            this.particles.destPositions.push(0);

            this.particles.colors.push(color.setHSL(1, 1, 0.6));
        }

        // GameHelper.readColorBufferFromTexture(sprites.sand_time.path).then((buffer) =>
        // {
        //     console.log(buffer);
        //     let count = 0;
        //     let index = 0;
        //     for (let i = 0, len = buffer.length; i < len; i += 4)
        //     {
        //         index = i / 4;
        //         this.particles.destPositions[count * 3] = index % this.wrapper.width;
        //         this.particles.destPositions[count * 3 + 1] = index / this.wrapper.width | 0;
        //         count++;
        //     }

        //     console.log(this.particles.destPositions);

        // });


        this.particles.geo = new THREE.BufferGeometry();
        this.particles.geo.addAttribute('position', new THREE.Float32BufferAttribute(this.particles.originPositions, 3));
        this.particles.geo.addAttribute('dest_position', new THREE.Float32BufferAttribute(this.particles.destPositions, 3));
        this.particles.geo.addAttribute('color', new THREE.Float32BufferAttribute(this.particles.colors, 3));

        this.particles.material = new THREE.ShaderMaterial({
            uniforms: this.particles.uniforms,
            vertexShader: this.vertexShaderCode(),
            fragmentShader: this.fragmentShaderCode(),
            blending: THREE.AdditiveBlending,
            // blendSrc: THREE.OneMinusSrcAlphaFactor,
            // blendDst: THREE.DstColorFactor,
            // alphaTest: 0.4,
            transparent: true,
            vertexColors: true
        });


        this.particles.system = new THREE.Points(this.particles.geo, this.particles.material);

        this.wrapper.scene.add(this.particles.system);
    }



    vertexShaderCode()
    {
        return `
            uniform float time;
            uniform float uAnimation;
            attribute vec3 dest_position;
            varying vec3 vColor;
            varying float vAlpha;
            varying vec2 vUv;

            vec3 mod289(vec3 x) {
                return x - floor(x * (1.0 / 289.0)) * 289.0;
            }
        
            vec2 mod289(vec2 x) {
                return x - floor(x * (1.0 / 289.0)) * 289.0;
            }
        
            vec3 permute(vec3 x) {
                return mod289(((x*34.0)+1.0)*x);
            }
        
            float snoise(vec2 v)
                {
                const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                                    0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                                -0.577350269189626,  // -1.0 + 2.0 * C.x
                                    0.024390243902439); // 1.0 / 41.0
            // First corner
                vec2 i  = floor(v + dot(v, C.yy) );
                vec2 x0 = v -   i + dot(i, C.xx);
        
            // Other corners
                vec2 i1;
                //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
                //i1.y = 1.0 - i1.x;
                i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                // x0 = x0 - 0.0 + 0.0 * C.xx ;
                // x1 = x0 - i1 + 1.0 * C.xx ;
                // x2 = x0 - 1.0 + 2.0 * C.xx ;
                vec4 x12 = x0.xyxy + C.xxzz;
                x12.xy -= i1;
        
            // Permutations
                i = mod289(i); // Avoid truncation effects in permutation
                vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                    + i.x + vec3(0.0, i1.x, 1.0 ));
        
                vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                m = m*m ;
                m = m*m ;
        
            // Gradients: 41 points uniformly over a line, mapped onto a diamond.
            // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)
        
                vec3 x = 2.0 * fract(p * C.www) - 1.0;
                vec3 h = abs(x) - 0.5;
                vec3 ox = floor(x + 0.5);
                vec3 a0 = x - ox;
        
            // Normalise gradients implicitly by scaling m
            // Approximation of: m *= inversesqrt( a0*a0 + h*h );
                m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        
            // Compute final noise value at P
                vec3 g;
                g.x  = a0.x  * x0.x  + h.x  * x0.y;
                g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                return 130.0 * dot(m, g);
            }
            // float rand(vec2 n) { 
            //   return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
            // }
            
            // float noise(vec2 p){
            //   vec2 ip = floor(p);
            //   vec2 u = fract(p);
            //   u = u*u*(3.0-2.0*u);
            
            //   float res = mix(
            //     mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
            //     mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
            //   return res*res;
            // }
            
            void main()
            {
                vUv = uv;
                vec3 pos = position;
                float animation = smoothstep(fract(dest_position.y * 421.0) * 0.5, 1.0 - fract(dest_position.y * 421.0) * 0.5, uAnimation );
                pos.x += snoise( position.xy * 0.02 + time) * (dest_position.y * 800.0 + 200.0);
                pos.y += snoise( position.xy * 0.01 + time) * (fract(dest_position.y * 32.0) * 800.0 + 200.0);
                
                // rotation 
                float d = length(pos);
                float angle = atan(pos.y, pos.x) + pow(d / 300.0, 0.3) * pow(animation, 0.5);
                
                pos.x = cos(angle) * d;
                pos.y = sin(angle) * d;
                vAlpha = animation;
                float x = mix(dest_position.x, pos.x, animation);
                float y = mix(dest_position.y, pos.y, animation);
                vec3 lerped = mix(pos, dest_position, animation);
                vColor = color;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(lerped, 1.0);
                gl_PointSize = 5.0;
            }
    `;
    }

    fragmentShaderCode()
    {
        return `
            uniform float time;
            uniform vec2 resolution;  
            uniform sampler2D pointTexture;

            varying vec3 vColor;
            varying float vAlpha;
            varying vec2 vUv;

            void main()	{
                vec4 ParticlePointTexture = texture2D(pointTexture, gl_PointCoord);
                vec3 c = vec3(1.0, 1.0, 0.0);
                gl_FragColor = vec4(c, 1.0) * ParticlePointTexture;
            }
        `;
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
}