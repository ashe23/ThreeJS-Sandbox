var container;
var camera, scene, renderer;
var uniforms;
var geo;
const particleCount = 100000;
var originPositions = [];
var destPositions = [];
var colors = [];
var uniforms = {
  time: { value: 1 },
  uAnimation: { value: 1 },
  pointTexture : { value: new THREE.TextureLoader().load('models/Textures/Roulette/T_Point.png') }
};

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
          gl_FragColor = vec4(mix(c, c2, 1.0), 1.0) * texture2D(pointTexture, gl_PointCoord);
        }

    `;
}

init();
animate();
// transition();
function init()
{
  container = document.getElementById('c');
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  scene = new THREE.Scene();

  let color = new THREE.Color();
  // filling original positions with random coordinates
  for (let i = 0; i < particleCount; ++i)
  {
    let x = THREE.Math.randFloat(-1, -0.7);
    let y = THREE.Math.randFloat(0.5, 1);
    let z = 0;

    originPositions.push(x);
    originPositions.push(y);
    originPositions.push(z);

    destPositions.push(THREE.Math.randFloat(-1, -0.8));
    destPositions.push(THREE.Math.randFloat(-1, -0.9));
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
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
    vertexColors: true
  });

  // creating particle system
  let particleSystem = new THREE.Points(geo, shaderMaterial);
  scene.add(particleSystem);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);


  // resize logic
  onWindowResize();
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize()
{
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function transition()
{
  TweenMax.fromTo(uniforms["uAnimation"], 4, { value: 0 }, { value: 1 });  
  // let duration = 2000;
  // let positions = geo.attributes.position.array;
  // for (let i = 0; i < particleCount; ++i)
  // {
  //     new TWEEN.Tween({ x: positions[i * 3], y: positions[i * 3 + 1], z: positions[i * 3 + 2] })
  //         .to({
  //             x: 0,
  //             y: 0,
  //             z: 0
  //         }, Math.random() * duration + duration)
  //         .easing(TWEEN.Easing.Exponential.InOut)
  //         .onUpdate((value) =>
  //         {
  //             positions[i * 3] = value.x;
  //             positions[i * 3 + 1] = value.y;
  //             positions[i * 3 + 2] = value.z;
  //             console.log(value);
  //         })
  //         .start();

  // }
}
//
function animate(timestamp)
{
  requestAnimationFrame(animate);


  // geo.attributes.dest_position.needsUpdate = true;

  // TWEEN.update(timestamp);
  uniforms["time"].value = timestamp / 100;
  renderer.render(scene, camera);
}
