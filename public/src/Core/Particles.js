import particlesVS from '../Core/glsl/particles.vs';
import particlesFS from '../Core/glsl/particles.fs';


export const PARTICLES_AMOUNT = 300;

export class Particles
{
    constructor(wrapper)
    {
        this.init_positions = [];
        this.velocities = [];
        this.accelerations = [];
        this.sizes = [];
        this.geo = new THREE.BufferGeometry();
        this.mesh = {};
        this.wrapper = wrapper;
    }

    init()
    {
        for (let i = 0; i < PARTICLES_AMOUNT; i++)
        {
            this.init_positions.push(THREE.Math.randFloat(-1, 1))
            this.init_positions.push(THREE.Math.randFloat(-1, 1))
            this.init_positions.push(0)
            this.velocities.push(THREE.Math.randFloat(-1, 1))
            this.velocities.push(THREE.Math.randFloat(-1, 1))
            this.velocities.push(0)
            this.accelerations.push(THREE.Math.randFloat(-1, 1))
            this.accelerations.push(THREE.Math.randFloat(-1, 1))
            this.accelerations.push(0)
            this.sizes.push(THREE.Math.randFloat(1, 30));
        }

        this.geo.addAttribute('position', new THREE.Float32BufferAttribute(this.init_positions, 3))
        this.geo.addAttribute('velocity', new THREE.Float32BufferAttribute(this.velocities, 3))
        this.geo.addAttribute('acceleration', new THREE.Float32BufferAttribute(this.accelerations, 3))
        this.geo.addAttribute('size', new THREE.Float32BufferAttribute(this.sizes, 1))

        const mat = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 12.0 },
                resolution: { value: new THREE.Vector2(this.wrapper.width, this.wrapper.height) },
                pointTexture: { value: new THREE.TextureLoader().load('textures/Roulette/T_Point.png') },
            },
            vertexShader: particlesVS,
            fragmentShader: particlesFS,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
            vertexColors: true
        });

        this.mesh = new THREE.Points(this.geo, mat);
        this.mesh.scale.set(50, 50, 50);
        this.mesh.position.z = 1;
    }

    loop()
    {
        this.mesh.material.uniforms.time.value = this.wrapper.clock.getElapsedTime();
        this.mesh.geometry.verticesNeedUpdate = true;
    }

}