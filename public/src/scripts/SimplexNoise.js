
var config = {
  str: 'Test Message',
  fontSize: 120,
  lineHeight: 1.0,
  baseLine: 0.7,

  play: function ()
  {
    TweenMax.fromTo(material.uniforms.uAnimation, 4, { value: 0 }, { value: 1 });
  },
  onStrChange: updateText
};

var prevStr = config.str;

var windowWidth;
var windowHeight;

var stats;

var renderer;
var scene;
var camera;

var geometry;
var material;
var mesh;

var fixedScale = 1;

var canvas;
var ctx;
var width;
var height;


var PARTICLES_AMOUNT = 3000000;
init();
config.play();
function init()
{

  canvas = document.getElementById('c');
  ctx = canvas.getContext('2d');
  // document.body.appendChild(canvas);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 3000);
  camera.position.z = 1000;
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x101010);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  geometry = new THREE.BufferGeometry();
  geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(PARTICLES_AMOUNT * 3), 3));
  geometry.addAttribute('extras', new THREE.BufferAttribute(new Float32Array(PARTICLES_AMOUNT * 2), 2));

  material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { type: 'f', value: 0 },
      uAnimation: { type: 'f', value: 0 },
      uOffset: { type: 'v2', value: new THREE.Vector2(-0.2, -10) }
    },
    vertexShader: vertexShaderCode(),
    fragmentShader: fragmentShaderCode(),
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: true,
    depthTest: false
  });
  console.log(geometry);

  mesh = new THREE.Points(geometry, material);
  scene.add(mesh);


  updateText();

  window.onresize = onResize;
  onResize();

  loop();

  config.play();
}

function updateText()
{
  var str = config.str;

  ctx.font = config.fontSize + 'px Oswald';
  var metrics = ctx.measureText(str);
  width = canvas.width = Math.ceil(metrics.width) || 1;
  height = canvas.height = Math.ceil(config.lineHeight * config.fontSize);
  ctx.font = config.fontSize + 'px Oswald';
  ctx.fillStyle = '#fff';
  ctx.fillText(str, 0, config.lineHeight * config.fontSize * config.baseLine);

  vertices = geometry.attributes.position.array;
  extras = geometry.attributes.extras.array;
  var index;
  var data = ctx.getImageData(0, 0, width, height).data;
  var count = 0;
  for (var i = 0, len = data.length; i < len; i += 4)
  {
    if (data[i + 3] > 0)
    {
      index = i / 4;
      vertices[count * 3] = index % width;
      vertices[count * 3 + 1] = index / width | 0;
      extras[count * 2] = data[i] / 255;
      extras[count * 2 + 1] = Math.random();
      count++;
    }
  }

  console.log(extras);
  geometry.attributes.position.needsUpdate = true;
  geometry.attributes.extras.needsUpdate = true;
  geometry.drawcalls = geometry.offsets = [{ start: 0, count: count, index: 0 }];
}

function onResize()
{
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;

  camera.aspect = windowWidth / windowHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(windowWidth, windowHeight);

  fixedScale = 2 * Math.tan(camera.fov / 360 * Math.PI) / windowHeight;

  render();
}

function vertexShaderCode()
{
  return `
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

      // uniform mat4 modelViewMatrix;
      // uniform mat4 projectionMatrix;
      // attribute vec3 position;
  
      attribute vec2 extras;
  
      uniform vec2 uOffset;
      uniform float uTime;
      uniform float uAnimation;
  
      varying float vAlpha;
  
      void main() {
  
          float animation = smoothstep(fract(extras.y * 121.0) * 0.5, 1.0 - fract(extras.y * 421.0) * 0.5, 1.0 - uAnimation);
  
          vec3 pos = position;
          pos.xy += uOffset;
          pos.y *= -1.0;
  
          pos.x += snoise(position.xy * 0.02 + uTime) * (200.0 + extras.y * 800.0) * animation;
          pos.y += snoise(position.xy * 0.01 + uTime) * (200.0 + fract(extras.y * 32.0) * 800.0) * animation;

  
          float d = length(pos);
          float angle = atan(pos.y, pos.x) + pow(d / 300.0, 0.3) * pow(animation, .5);
  
          pos.x = cos(angle) * d;
          pos.y = sin(angle) * d;
  
          vAlpha = extras.x - pow(animation, 0.7);
  
          gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
          gl_PointSize = 3.0 + animation * (10.0 + extras.y * 20.0);
          // gl_PointSize = 3.0;
  
      }
    `;
}

function fragmentShaderCode()
{
  return `
    precision mediump float;
    precision mediump int;

    varying float vAlpha;

    void main() {
        float d = length(gl_PointCoord.xy - .5) * 2.0;

        float c = 1.0 - clamp(d, 0.0, 1.0);

        vec3 color = mix(vec3(0.8, 0.7, 1.0), vec3(1.0), vAlpha);
        
        gl_FragColor = vec4(color, vAlpha * c);
    }
    `;
}

function loop()
{
  requestAnimationFrame(loop);
  render();
}

function render()
{

  mesh.position.copy(camera.position);
  mesh.rotation.copy(camera.rotation);
  mesh.translateZ(-1 / fixedScale);

  material.uniforms.uTime.value += 0.003;
  material.uniforms.uOffset.value.set(-width / 2, -height / 2);
  renderer.render(scene, camera);

}