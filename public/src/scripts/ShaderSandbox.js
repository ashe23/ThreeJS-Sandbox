
window.onload = () =>
{
    const canvas = document.querySelector('#c');
    let scene, renderer, camera, clock;
    const ratio = window.innerWidth / window.innerHeight;
    let bMouseDown = false;
    let touchX, touchY;

    scene = new THREE.Scene();
    clock = new THREE.Clock();

    camera = new THREE.PerspectiveCamera(40, ratio, 1, 10000);
    camera.position.z = 300;

    renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // testing particles
    let geometry = new THREE.BufferGeometry();

    const particleCount = 1000;
    const radius = 200;
    let positions = [];
    let colors = [];
    let sizes = [];
    let velocities = [];

    let color = new THREE.Color();

    for (let i = 0; i < particleCount; ++i)
    {
        positions.push(0, 0, 1.83);
        velocities.push((Math.random() * 2 - 1) * 0.05, (Math.random() * 2 - 1) * 0.05, .93 + Math.random() * 0.02);
        // positions.push((Math.random() * 2 - 1) * radius);
        // positions.push((Math.random() * 2 - 1) * radius);
        // positions.push((Math.random() * 2 - 1) * radius);
        color.setRGB(1, 1, 0);
        colors.push(color.r, color.g, color.b);

        sizes.push(5);
    }

    geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.addAttribute('size', new THREE.Float32BufferAttribute(sizes, 1).setDynamic(true));
    console.log(positions, geometry.attributes);


    let uniforms = {
        time: { value: 1 },
        pointTexture: { value: new THREE.TextureLoader().load("textures/spark1.png") },
        randomPoint: { value: (Math.random() * 2 - 1) * 5 }
    };

    let shaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader(),
        fragmentShader: fragmentShader(),
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        vertexColors: true
    });
    let particleSystem = new THREE.Points(geometry, shaderMaterial);
    scene.add(particleSystem);


    // end testing particles



    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousedown', (event) =>
    {
        bMouseDown = true;
        touchX = event.clientX;
        touchY = event.clientY;
        console.log(event);
    }, false);
    window.addEventListener('mouseup', () => { bMouseDown = false; }, false);

    function vertexShader()
    {
        return `
            attribute float size;
            varying vec3 vColor;
            uniform float time;
          
            #define MOV(a,b,c,d,t) (vec2(a*cos(t)+b*cos(0.1*(t)), c*sin(t)+d*cos(0.1*(t))))
            float PHI = 1.61803398874989484820459 * 00000.1; // Golden Ratio   
            float PI  = 3.14159265358979323846264 * 00000.1; // PI
            float SQ2 = 1.41421356237309504880169 * 10000.0; // Square Root of Two
            
            float rand(in vec2 coordinate, in float seed) {
                return fract(tan(distance(coordinate*(seed+PHI), vec2(PHI, PI)))*SQ2) * 100.0;
            }

            void main() {
                vColor = color;
                float offset = 10.0;
                float speed = 2.0;
                float dTime = time / 0.1;
                float dYTime = sin(dTime) * offset;
                float dXTime = dTime * offset;
                vec3 CurrentVertexPosition = position;
                vec3 Destination = vec3(0,0,0);
                float alpha = sin(time);
                vec3 OffsetLoc = vec3(rand(vec2(CurrentVertexPosition.x,CurrentVertexPosition.y),time * PHI),rand(vec2(CurrentVertexPosition.x,CurrentVertexPosition.y),time * PHI),1.0);
                vec3 CurrentLocation = mix(CurrentVertexPosition + OffsetLoc, Destination, alpha);
				vec4 mvPosition = modelViewMatrix * vec4(CurrentLocation.x, CurrentLocation.y,0, 1.0 );
				gl_PointSize = size;
                // gl_Position = projectionMatrix * mvPosition;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x,position.y,position.z,1.0);
            }
        `;
    }
    function fragmentShader()
    {
        return `
            uniform sampler2D pointTexture;
			varying vec3 vColor;

            void main() {
                gl_FragColor = vec4( vColor, 1.0 ) * vec4(100,100,0,1);
				gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
            }
        `;
    }


    function onWindowResize()
    {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function render()
    {

        let time = Date.now() * 0.005;
        // particleSystem.rotation.y = 0.01 * time;
        // let sizes = geometry.attributes.size.array;
        // for (let i = 0; i < particleCount; i++) {
        //     sizes[i] = 10 * (1 + Math.sin(0.1 * i + time));
        // }
        // geometry.attributes.size.needsUpdate = true;


        // let i, n = geometry.attributes.position.array.length, p, bp;
        // for (i = 0; i < particleCount; i += 2) {
        //     bp = i * 3;

        //     // horizontal
        //     geometry.attributes.position[bp] = geometry.attributes.position[bp + 3];
        //     geometry.attributes.position[bp + 1] = geometry.attributes.position[bp + 4];

        //     velocities[bp] *= velocities[bp + 2];
        //     velocities[bp + 1] *= velocities[bp + 2];

        //     p = geometry.attributes.position[bp + 3];
        //     p += velocities[bp];

        //     if (p < -ratio) {
        //         p = -ratio;
        //         velocities[bp] = Math.abs(velocities[bp]);
        //     } else if (p > ratio) {
        //         p = ratio;
        //         velocities[bp] = Math.abs(velocities[bp]);
        //     }

        //     geometry.attributes.position[bp + 3] = p;


        //     // vertical
        //     p = geometry.attributes.position[bp + 4];
        //     p += velocities[bp + 1];
        //     if (p < -1) {
        //         p = -1;
        //         velocities[bp + 1] = Math.abs(velocities[bp + 1]);
        //     } else if (p > 1) {
        //         p = 1;
        //         velocities[bp + 1] = -Math.abs(velocities[bp + 1]);
        //     }

        //     geometry.attributes.position[bp + 4] = p;


        //     if (bMouseDown) {
        //         let dx = touchX - geometry.attributes.position[bp];
        //         let dy = touchY - geometry.attributes.position[bp + 1];
        //         let d = Math.sqrt(dx * dx + dy * dy);
        //         console.log(geometry.attributes);
        //         debugger;
        //         if (d < 2) {
        //             if (d < 0.03) {
        //                 geometry.attributes.position[bp + 3] = (Math.random() * 2 - 1) * ratio;
        //                 geometry.attributes.position[bp + 4] = Math.random() * 2 - 1;
        //                 velocities[bp] = 0;
        //                 velocities[bp + 1] = 0;
        //             }
        //             else {
        //                 dx /= d;
        //                 dy /= d;
        //                 d = (2 - d) / 2;
        //                 d *= d;
        //                 velocities[bp] += dx * d * 0.01;
        //                 velocities[bp + 1] += dy * d * 0.01;
        //             }
        //         }
        //     }
        // }

        let positionsArray = geometry.attributes.position.array;
        let bp, p;
        for (let i = 0; i < particleCount; i += 2)
        {
            bp = i * 3;
            positionsArray[bp] = positionsArray[bp + 3];
            positionsArray[bp + 1] = positionsArray[bp + 4];

            velocities[bp] *= velocities[bp + 2];
            velocities[bp + 1] *= velocities[bp + 2];

            // horizontal
            p = positionsArray[bp + 3];
            p += velocities[bp];
            if (p < -ratio)
            {
                p = -ratio;
                velocities[bp] = Math.abs(velocities[bp]);
            } else if (p > ratio)
            {
                p = ratio;
                velocities[bp] = -Math.abs(velocities[bp]);
            }
            positionsArray[bp + 3] = p;

            // vertical
            p = positionsArray[bp + 4];
            p += velocities[bp + 1];
            if (p < -1)
            {
                p = -1;
                velocities[bp] = Math.abs(velocities[bp + 1]);
            } else if (p > 1)
            {
                p = 1;
                velocities[bp] = -Math.abs(velocities[bp + 1]);
            }
            positionsArray[bp + 4] = p;

            if (bMouseDown)
            {
                let dx = touchX - positionsArray[bp];
                let dy = touchY - positionsArray[bp + 1];
                let d = Math.sqrt(dx * dx + dy * dy);
                if (d < 2)
                {
                    if (d < 0.03)
                    {
                        positionsArray[bp + 3] = (Math.random() * 2 - 1) * ratio;
                        positionsArray[bp + 4] = Math.random() * 2 - 1;
                        velocities[bp] = 0;
                        velocities[bp + 1] = 0;
                    } else
                    {
                        dx /= d;
                        dy /= d;
                        d = (2 - d) / 2;
                        d *= d;
                        velocities[bp] += dx * d * 0.01;
                        velocities[bp + 1] += dy * d * 0.01;
                    }
                }
            }


        }
        geometry.attributes.position.needsUpdate = true;

        uniforms.time.value = clock.getElapsedTime();
        uniforms.time.needsUpdate = true;

        renderer.render(scene, camera);
        requestAnimationFrame(() => render());
    }

    render();
};