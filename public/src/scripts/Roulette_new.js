let camera, cameraOrtho, renderer, scene, sceneOrtho;
let sprite_numberpad, arrow;

let sprites = {
    bg: 'models/Textures/Roulette/T_BG.png',
    number_pad: 'models/Textures/Roulette/numberpad.png',
    arrow: 'models/Textures/Roulette/T_Arrow.png',
    point: 'models/Textures/Roulette/T_Point.png',
    sand_time: 'models/Textures/Roulette/T_SandTime.png',
    roulette1: 'models/Textures/Roulette/roulette_1.png',
    roulette2: 'models/Textures/Roulette/roulette_2.png',
    roulette3: 'models/Textures/Roulette/roulette_3.png'
};

const FPS = 60;
const step = 1 / FPS;
const duration = 20;
let time = 0;
let offset = 0;
const SpinCount = 10;
let DesiredNumber = 18;
const SingleNumberAngle = -0.1698;
const NumberSequence = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const particleCount = 10000;
const GameState = {
    idle: 1,
    spinning: 2
};
let CurrentGameState = GameState.idle;

const width = window.innerWidth;
const height = window.innerHeight;

let originPositions = [];
let destPositions = [];
let colors = [];

var uniforms = {
    time: { value: 1 },
    uAnimation: { value: 1 },
    pointTexture: { value: new THREE.TextureLoader().load('models/Textures/Roulette/T_Point.png') }
};


function init()
{
    console.log(width, height);
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

    gameLogic();

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
        if (time > duration) 
        {
            CurrentGameState = GameState.idle;
            time = 0;
            Offset = sprite_numberpad.material.rotation / (Math.PI * 2);
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
    let width = window.innerWidth;
    let height = window.innerHeight;
    let aspect_ratio = width / height;

    console.log(width, height);

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

    let sprite_roulette2 = SpriteLoader(sprites.roulette2);
    sceneOrtho.add(sprite_roulette2);
    sprite_roulette2.scale.set(500, 500, 1);

    let sprite_roulette3 = SpriteLoader(sprites.roulette3);
    sceneOrtho.add(sprite_roulette3);
    sprite_roulette3.scale.set(200, 200, 1);

    sprite_numberpad = SpriteLoader(sprites.number_pad);
    sceneOrtho.add(sprite_numberpad);
    sprite_numberpad.scale.set(400, 400, 1);

    let sandbox = SpriteLoader(sprites.sand_time);
    sceneOrtho.add(sandbox);
    sandbox.scale.set(70, 100, 1);
    sandbox.center.set(8.5, 4.5);

    arrow = SpriteLoader(sprites.arrow);
    sceneOrtho.add(arrow);
    arrow.scale.set(40, 60, 1);
    arrow.center.set(0.5, -3.5);


    // let sprite = new THREE.TextSprite({
    //     textSize: 10,
    //     texture: {
    //         text: 'Hello World!',
    //         fontFamily: 'Arial, Helvetica, sans-serif',
    //     },
    //     material: {color: 0xffbbff},
    // });
    // sceneOrtho.add(sprite);


    // sprite_numberpad = SpriteLoader(sprites.number_pad);
    // sceneOrtho.add(sprite_numberpad);
    // console.log(sprite_numberpad);
    // sprite_numberpad.scale.set(400, 380, 1);
    // sprite_numberpad.material.blending = THREE.AdditiveBlending;

    // let sprite_arrow = SpriteLoader(sprites.arrow);
    // sceneOrtho.add(sprite_arrow);
    // sprite_arrow.scale.set(100,100,1);
    // sprite_arrow.center.set(0.5, -3);
    // sprite_arrow.blending = THREE.AdditiveBlending;

    // background particles
    let color = new THREE.Color();
    // filling original positions with random coordinates
    for (let i = 0; i < particleCount; ++i)
    {
        let x = THREE.Math.randFloat(-1, 1);
        let y = THREE.Math.randFloat(-1, 1);
        let z = 0;

        originPositions.push(x);
        originPositions.push(y);
        originPositions.push(z);

        destPositions.push(THREE.Math.randFloat(-1, 1));
        destPositions.push(THREE.Math.randFloat(-1, 1));
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
    particleSystem.scale.set(50, 50, 1);
    scene.add(particleSystem);
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
    sprite_numberpad.material.rotation = - lerp(offset, Math.PI * 2 * SpinCount + NumberSequence.indexOf(DesiredNumber) * SingleNumberAngle, easeOutQuart(time / duration));
}

function SpriteLoader(path, scale)
{
    if (!scale) scale = new THREE.Vector3(1, 1, 1);

    let spriteMap = new THREE.TextureLoader().load(path);
    let spriteMaterial = new THREE.SpriteMaterial({
        map: spriteMap,
        color: 0xffffff,
        blending: THREE.NormalBlending
        // opacity: 0.2
    });
    let sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(scale.x, scale.y, scale.z);
    // sprite.position.set(position.x, position.y, position.z);
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

            vec3 dest = vec3(1.0, -0.5, 0.0);

            float animation = smoothstep(1.0 - fract(dest_position.y), fract(dest_position.y), uAnimation );

            pos.x += snoise( position.xy * 20.0 - time) * (dest.y / 20.0);
            pos.y += snoise( position.xy * 10.0 - time) * (dest.y * 90.0 );


            // rotation 
            float d = length(pos);
            float angle = atan(pos.y, pos.x) + pow(d / 10.0, 0.8) * pow(animation, 0.5);

            pos.x = cos(angle) * d;
            pos.y = sin(angle) * d;

            vAlpha = abs(sin(time));

            float x = mix(dest_position.x, pos.x, abs(sin(time)));
            float y = mix(dest_position.y, pos.y, abs(sin(time)));

            vec3 lerped = mix(pos, dest_position, abs(sin(time / 10.0)));
            // pos.x += snoise(position.xy) * x;
            // pos.y += snoise(position.xy) * y;

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


window.onload = () =>
{
    init();
    animate();
    setTimeout(() =>
    {
        CurrentGameState = GameState.spinning;
    }, 2000);

}
