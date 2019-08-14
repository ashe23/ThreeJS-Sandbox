var container;
var camera, scene, renderer;
var uniforms;
var geo;
const particleCount = 1000;

function vertexShaderCode()
{
    return `
        varying vec2 vUv;
        uniform float time;

        void main()	{
            vUv = uv;  
            vec3 p = vec3(sin(time / 10.0), cos(time / 10.0), 0);          
            // gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );
            gl_Position = vec4(position, 1.0);
            gl_PointSize = 2.0;
        }
    `;
}

function fragmentShaderCode()
{
    return `
        varying vec2 vUv;
        uniform float time;
        uniform vec2 resolution;

        void main()	{
            gl_FragColor = vec4(0.9, 0.3, 0.4, 1.0);
        }

    `;
}

init();
animate();
transition();
function init()
{
    container = document.getElementById('c');
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    scene = new THREE.Scene();
    uniforms = {
        time: { value: 1 },
    };
    // var curve = new THREE.CubicBezierCurve3(
    //     new THREE.Vector3(-0.7, 0, 0),
    //     new THREE.Vector3(-0.5, .9, 0),
    //     new THREE.Vector3(1.0, 0.9, 0),
    //     new THREE.Vector3(0.5, 0, 0)
    // );

    // const points = curve.getPoints(10);
    let positions = [];

    for (let i = 0; i < particleCount; ++i)
    {
        positions.push(THREE.Math.randFloat(-1, 1));
        positions.push(THREE.Math.randFloat(-1, 1));
        positions.push(THREE.Math.randFloat(-1, 1));
    }

    geo = new THREE.BufferGeometry();
    geo.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3).setDynamic(true));

    let shaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShaderCode(),
        fragmentShader: fragmentShaderCode(),
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        vertexColors: true
    });
    let particleSystem = new THREE.Points(geo, shaderMaterial);
    scene.add(particleSystem);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
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
    let duration = 2000;
    let positions = geo.attributes.position.array;
    for (let i = 0; i < particleCount; ++i)
    {
        new TWEEN.Tween({ x: positions[i * 3], y: positions[i * 3 + 1], z: positions[i * 3 + 2] })
            .to({
                x: 0,
                y: 0,
                z: 0
            }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .onUpdate((value) =>
            {
                positions[i*3] = value.x;
                positions[i*3+1] = value.y;
                positions[i*3+2] = value.z;
                console.log(value);
            })
            .start();

    }
}
//
function animate(timestamp)
{
    requestAnimationFrame(animate);


    geo.attributes.position.needsUpdate = true;

    TWEEN.update(timestamp);
    uniforms["time"].value = timestamp / 100;
    renderer.render(scene, camera);
}
