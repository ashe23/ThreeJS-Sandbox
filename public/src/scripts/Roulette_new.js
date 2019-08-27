let game = new RouletteGame();
let camera, cameraOrtho, renderer, scene, sceneOrtho, clock;
let sprite_numberpad, arrow, sandbox, sprite_roulette2;
let countdownValue = 0;
let timerIntervalHandler, Timertexture, TimerMaterial, TimerSprite;
let WinNumberTexture, WinNumberMaterial;
let ArrowTimerHandler, ArrowTimerFrequency = 300, RotationAnimDuration = 0.01;

let lastNumber;

let sprites = {
    bg: 'models/Textures/Roulette/T_BG.png',
    number_pad: 'models/Textures/Roulette/numberpad.png',
    arrow: 'models/Textures/Roulette/T_Arrow.png',
    point: 'models/Textures/Roulette/T_Point.png',
    sand_time: 'models/Textures/Roulette/T_SandTime.png',
    roulette1: 'models/Textures/Roulette/roulette_1.png',
    roulette2: 'models/Textures/Roulette/roulette_2.png',
    roulette3: 'models/Textures/Roulette/roulette_3.png',
    dissolve: 'models/Textures/Roulette/Dissolve.png',
};


// Roulette numpad spin data
let time = 0;
let offset = 0;
let DesiredNumber = 18;
const FPS = 60;
const step = 1 / FPS;
const duration = 10;
const SpinCount = 5;
const SingleNumberAngle = -0.1745329251994; // radian
const NumberSequence = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 21, 13, 36, 11, 30, 8, 23, 5, 24, 18, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const particleCount = 10000;
const GameState = {
    idle: 1,
    spinning: 2,
    preStopSpin: 3,
};
let CurrentGameState = GameState.idle;

let width = window.innerWidth;
let height = window.innerHeight;

let originPositions = [];
let destPositions = [];
let colors = [];

var uniforms = {
    time: { value: 1 },
    uAnimation: { value: 1 },
    pointTexture: { value: new THREE.TextureLoader().load('models/Textures/Roulette/T_Point.png') },
    dissolveTexture: { value: new THREE.TextureLoader().load(sprites.dissolve) },
};


function init()
{
    camera = new THREE.PerspectiveCamera(60, width / height, 1, 2100);
    camera.position.z = 1500;

    cameraOrtho = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 1, 10);
    cameraOrtho.position.z = 1;

    scene = new THREE.Scene();
    sceneOrtho = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.autoClear = false;
    document.body.appendChild(renderer.domElement);

    clock = new THREE.Clock();


    gameLogic();

    sprite_numberpad.material.rotation = 0;

    onWindowResize();
    window.addEventListener('resize', onWindowResize, false);
}

function animate(timestamp)
{
    requestAnimationFrame(animate);


    if (CurrentGameState === GameState.spinning)
    {
        time += step;
        RouletteSpin(time);
        RotationAnimDuration = THREE.Math.mapLinear(time, 0 , duration + 2, 0, 1);


        // console.log(ArrowTimerFrequency);
        // change number based on rotation speed
        // WinNumberTexture.text = NumberSequence[THREE.Math.randInt(0, NumberSequence.length - 1)].toString();
        // TweenMax.fromTo(WinNumberTexture, duration, { text: WinNumberTexture.text }, { text: NumberSequence[THREE.Math.randInt(0, NumberSequence.length - 1)].toString() });

        // if(time + 2 > duration)
        // {
        //     clearInterval(ArrowTimerHandler);
        //     arrow.material.rotation = TweenMax.fromTo(arrow.material, 0.8, { rotation: arrow.material.rotation }, { rotation: 0 });
        // }

        if (time + 1 > duration)
        {
            CurrentGameState = GameState.idle;
            time = 0;
            offset = sprite_numberpad.material.rotation / (Math.PI * 2);
            WinNumberTexture.text = DesiredNumber.toString();
            arrow.material.rotation = 0;
            setTimeout(CountDownStart, 5000);
        }
    }

    uniforms["time"].value = timestamp / 100;
    renderer.clear();
    renderer.render(scene, camera);
    renderer.clearDepth();
    renderer.render(sceneOrtho, cameraOrtho);
}

function onWindowResize()
{
    width = window.innerWidth;
    height = window.innerHeight;
    let aspect_ratio = width / height;

    camera.aspect = aspect_ratio;
    camera.updateProjectionMatrix();

    cameraOrtho.left = -width / 2;
    cameraOrtho.right = width / 2;
    cameraOrtho.top = height / 2;
    cameraOrtho.bottom = -height / 2;
    cameraOrtho.updateProjectionMatrix();

    renderer.setSize(width, height);
}

function gameLogic()
{
    // sprites  
    let sprite_bg = SpriteLoader(sprites.bg);
    scene.add(sprite_bg);
    sprite_bg.scale.set(4000, 2000, 1);

    let sprite_roulette1 = SpriteLoader(sprites.roulette1);
    sceneOrtho.add(sprite_roulette1);
    sprite_roulette1.scale.set(500, 500, 1);

    sprite_roulette2 = SpriteLoader(sprites.roulette2);
    sceneOrtho.add(sprite_roulette2);
    sprite_roulette2.scale.set(500, 500, 1);

    let sprite_roulette3 = SpriteLoader(sprites.roulette3);
    sceneOrtho.add(sprite_roulette3);
    sprite_roulette3.scale.set(200, 200, 1);

    sprite_numberpad = SpriteLoader(sprites.number_pad);
    sceneOrtho.add(sprite_numberpad);
    sprite_numberpad.scale.set(400, 400, 1);

    sandbox = SpriteLoader(sprites.sand_time);
    sceneOrtho.add(sandbox);
    sandbox.scale.set(70, 100, 1);
    sandbox.center.set(8.5, 4.5);

    arrow = SpriteLoader(sprites.arrow);
    sceneOrtho.add(arrow);
    arrow.scale.set(40, 60, 1);
    // arrow.material.rotation += Math.PI / 4;
    arrow.position.set(0, 250, 0);

    // background particles
    let color = new THREE.Color();
    // filling original positions with random coordinates
    for (let i = 0; i < particleCount; ++i)
    {
        let x = THREE.Math.randFloat(-width, width);
        let y = THREE.Math.randFloat(-height, height);
        let z = 0;

        originPositions.push(x);
        originPositions.push(y);
        originPositions.push(z);

        destPositions.push(THREE.Math.randFloat(-width, -width + 500));
        destPositions.push(THREE.Math.randFloat(-height, -height + 500));
        destPositions.push(0);

        colors.push(color.setHSL(1, 1.0, 0.6));
    }

    // creating geometry buffer
    geo = new THREE.BufferGeometry();
    geo.addAttribute('position', new THREE.Float32BufferAttribute(originPositions, 3));
    geo.addAttribute('dest_position', new THREE.Float32BufferAttribute(destPositions, 3));
    geo.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // creating simple shader material
    let shaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShaderCode(),
        fragmentShader: fragmentShaderCode(),
        blending: THREE.NormalBlending,
        depthTest: false,
        transparent: true,
        vertexColors: true
    });

    // creating particle system
    let particleSystem = new THREE.Points(geo, shaderMaterial);
    // particleSystem.scale.set(50, 50, 1);
    // scene.add(particleSystem);

    Timertexture = new THREE.TextTexture({
        fontFamily: '"Roboto"',
        fontSize: 32,
        // fontStyle: 'italic',
        text: ['00:00'].join('\n'),
    });
    TimerMaterial = new THREE.SpriteMaterial({
        color: 0xffffbb,
        map: Timertexture,
    });
    TimerSprite = new THREE.Sprite(TimerMaterial);
    TimerSprite.scale.setX(Timertexture.image.width / Timertexture.image.height).multiplyScalar(40);
    TimerSprite.center.set(7.48, 8.5);
    sceneOrtho.add(TimerSprite);


    WinNumberTexture = new THREE.TextTexture({
        fontFamily: '"Times New Roman", Times, serif',
        fontSize: 128,
        text: '0',
    });
    WinNumberMaterial = new THREE.SpriteMaterial({
        color: 0xffffbb,
        map: WinNumberTexture,
    });

    let WinNumberSprite = new THREE.Sprite(WinNumberMaterial);
    WinNumberSprite.scale.setX(1.3).multiplyScalar(100);
    WinNumberSprite.position.set(4, -5, 0);
    sceneOrtho.add(WinNumberSprite);
}

function lerp(a, b, t)
{
    return (1 - t) * a + t * b;
}

function ease(t)
{
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function easeOutQuart(t)
{
    return 1 - Math.pow(1 - t, 4);
}

function RouletteSpin(time)
{
    if (!sprite_numberpad) return;

    let DesiredRotation = Math.PI * 2 * SpinCount + NumberSequence.indexOf(DesiredNumber) * SingleNumberAngle;
    sprite_numberpad.material.rotation = -lerp(offset, DesiredRotation, easeOutQuart(time / duration));
    sprite_roulette2.material.rotation = -lerp(offset, DesiredRotation, easeOutQuart(time / duration));

    if (WinNumberTexture.text != GetNumberBasedOnRotation(sprite_numberpad.material.rotation))
    {
        // RotateArrow(time);
    }

    WinNumberTexture.text = GetNumberBasedOnRotation(sprite_numberpad.material.rotation);
}

function RotateArrow()
{
    let tween;
    if (CurrentGameState === GameState.spinning)
    {
        // RotationAnimDuration = THREE.Math.mapLinear(clock.getElapsedTime(), 0 , duration - 1, 0, 0.2);
        console.log(RotationAnimDuration);
        tween = TweenMax.fromTo(arrow.material, RotationAnimDuration, { rotation: 0 }, { rotation: Math.PI / 4 });
        setTimeout(RotateArrow, (RotationAnimDuration + 0.01) * 1000);
    }
    else
    {
        TweenMax.killTweensOf(tween);

        if (arrow.material.rotation != 0)
        {
            TweenMax.fromTo(arrow.material, 0.1, { rotation: arrow.material.rotation }, { rotation: 0 });
            RotationAnimDuration = 0.01;
        }
    }
}

function GetNumberBasedOnRotation(rotation)
{
    let index = Math.abs(Math.ceil(rotation % (Math.PI * 2) / (SingleNumberAngle - 0.01)));

    if (index == 0)
    {
        return NumberSequence[0].toString();
    }

    return NumberSequence[NumberSequence.length - index].toString();
}

function SpriteLoader(path, scale)
{
    if (!scale) scale = new THREE.Vector3(1, 1, 1);

    let spriteMap = new THREE.TextureLoader().load(path);
    let spriteMaterial = new THREE.SpriteMaterial({
        map: spriteMap,
        color: 0xffffff,
        blending: THREE.NormalBlending
    });
    let sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(scale.x, scale.y, scale.z);
    return sprite;
}

function vertexShaderCode()
{
    return `
        uniform float time;
        uniform float uAnimation;
        attribute vec3 dest_position;
        varying vec3 vColor;
        varying float vAlpha;

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
            // gl_Position = projectionMatrix * modelViewMatrix * vec4(dest_position, 1.0);
            // gl_Position = vec4(dest_position, 1.0);
            gl_PointSize = 5.0;
        }
    `;
}

function fragmentShaderCode()
{
    return `
        uniform float time;
        uniform vec2 resolution;  
        uniform sampler2D pointTexture;

        varying vec3 vColor;
        varying float vAlpha;

        void main()	{
          vec3 c = vec3(1.0, 1.0, 0.0);
          vec3 c2 = vec3(1.0, 1.0, 1.0);
          gl_FragColor = vec4(mix(c, c2, 1.0), 1.0) * texture2D(pointTexture, gl_PointCoord) * vec4(10.0,10.0,10.0, 1.0);
        }
    `;
}


function StartGame()
{
    CurrentGameState = GameState.spinning;
}

function CountDownStart()
{
    let minutes = THREE.Math.randInt(0, 0);
    let seconds = THREE.Math.randInt(0, 3);

    DesiredNumber = NumberSequence[THREE.Math.randInt(0, NumberSequence.length - 1)];
    // DesiredNumber = 5;
    // console.log(DesiredNumber);
    // console.log(minutes + ":" + seconds);
    countdownValue = (minutes * 60 + seconds) * 1000;

    TweenMax.fromTo(TimerMaterial, 2, { opacity: 0 }, { opacity: 1 });
    setTimeout(StartGame, countdownValue);
    timerIntervalHandler = setInterval(CountDownTextUpdate, 1000);


    setTimeout(RotateArrow, countdownValue);
    // ArrowTimerHandler = setInterval(RotateArrow, 1000)
}

function CountDownTextUpdate()
{
    if (countdownValue === 0)
    {
        clearInterval(timerIntervalHandler);
        console.log('Timer stopped');

        TweenMax.fromTo(TimerMaterial, 2, { opacity: 1 }, { opacity: 0 });
        return;
    }
    countdownValue -= 1000;
    Timertexture.text = millisToMinutesAndSeconds(countdownValue);
}

function millisToMinutesAndSeconds(millis)
{
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

window.onload = () =>
{
    init();
    animate();

    CountDownStart();
}
