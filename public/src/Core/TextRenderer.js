import numbersVertShaderCode from '../../shaders/numbers.vs'
import numbersFragShaderCode from '../../shaders/numbers.fs'
import { Sprites } from './RouletteSprites.js'

const PARTICLE_COUNT = 100000;

export class TextRenderer
{
    constructor(text, wrapper, fontSize, position)
    {
        this.text = text;
        this.wrapper = wrapper;
        this.fontSize = fontSize ? fontSize : 10;
        this.position = position ? position : new THREE.Vector3(0);

        this.canvasText = {
            material: {},
            mesh: {},
            geometry: {},
            fontSize: 20,
            font: "Roboto",
            lineHeight: 1.1,
            baseLine: 0.9,
        };

        this.canvasText.canvas = document.createElement('canvas');
        this.canvasText.canvas.width = 500;
        this.canvasText.canvas.height = 500;
        this.canvasText.ctx = this.canvasText.canvas.getContext('2d');
        this.canvasText.canvas.style = "border:1px solid black";

        this.canvasText.geometry = new THREE.BufferGeometry();
        this.canvasText.geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(PARTICLE_COUNT * 3), 3));
        this.canvasText.geometry.addAttribute('extras', new THREE.BufferAttribute(new Float32Array(PARTICLE_COUNT * 2), 2));

        this.canvasText.material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { type: 'f', value: 0 },
                uAnimation: { type: 'f', value: 1 },
                uOffset: { type: 'v2', value: new THREE.Vector2() },
                pointTexture: { value: new THREE.TextureLoader().load(Sprites.point.path) },
            },
            vertexShader: numbersVertShaderCode,
            fragmentShader: numbersFragShaderCode,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: true,
            depthTest: false
        });


        this.canvasText.mesh = new THREE.Points(this.canvasText.geometry, this.canvasText.material);

        this.wrapper.textScene.add(this.canvasText.mesh);

        this.updateText();
    }

    updateText()
    {
        this.canvasText.ctx.font = this.fontSize + 'px ' + this.canvasText.font;

        let metrics = this.canvasText.ctx.measureText(this.text);
        let width = Math.ceil(metrics.width) || 1;
        let height = this.fontSize + 10;

        // clearing old data
        this.clearGeometryBuffers();

        // redrawing new one
        this.canvasText.ctx.font = this.fontSize + 'px ' + this.canvasText.font;
        this.canvasText.ctx.fillStyle = '#000';
        this.canvasText.ctx.fillText(this.text, 0, this.fontSize);

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

        this.canvasText.mesh.position.set(this.position.x, this.position.y, this.position.z);
        this.canvasText.geometry.attributes.position.needsUpdate = true;
        this.canvasText.geometry.attributes.extras.needsUpdate = true;
    }

    loop()
    {
        this.canvasText.material.uniforms.uTime.value = this.wrapper.clock.getElapsedTime();
    }

    play(duration)
    {
        let d = duration ? duration : 1;
        TweenMax.fromTo(this.canvasText.material.uniforms.uAnimation, d, { value: 0 }, { value: 1 });
    }

    reverse(duration)
    {
        let d = duration ? duration : 1;
        TweenMax.fromTo(this.canvasText.material.uniforms.uAnimation, d, { value: 1 }, { value: 0 });
    }

    playScaleAnim()
    {
        TweenMax.fromTo(this, 5, { fontSize: 20 }, { fontSize: 40 });
        this.updateText();
    }

    clearGeometryBuffers()
    {
        this.canvasText.ctx.clearRect(0, 0, this.canvasText.canvas.width, this.canvasText.canvas.height);

        for (let i = 0; i < this.canvasText.geometry.attributes.position.array.length; ++i)
        {
            this.canvasText.geometry.attributes.position.array[i] = 0;
        }
        for (let i = 0; i < this.canvasText.geometry.attributes.extras.array.length; ++i)
        {
            this.canvasText.geometry.attributes.extras.array[i] = 0;
        }
    }
}